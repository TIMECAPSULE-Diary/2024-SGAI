import zipfile
import pandas as pd
import json
import boto3
import json
import deepl
import requests

from collections.abc import Mapping
from getpass import getpass
from elasticsearch import Elasticsearch, helpers
from openai import OpenAI

bedrock = boto3.client('bedrock-runtime', aws_access_key_id=access_key, aws_secret_access_key=secret_key, region_name=region)


client = Elasticsearch(IP)

def download_image(url, file_name):
    # 이미지 다운로드
    response = requests.get(url)
    
    # 요청이 성공했는지 확인
    if response.status_code == 200:
        # 파일 저장
        with open(file_name, 'wb') as file:
            file.write(response.content)
    return response.status_code
        
def getTraslation(text):
    translator = deepl.Translator(auth_key)
    message = text
    result = translator.translate_text(message, target_lang="ko")
    return result.text
    
def getQueyrEmbedding(query):
    request_body = json.dumps({
        "texts": [query],
        "input_type": "search_query",
        "truncate": "NONE"
    })

    # Bedrock API 호출
    response = bedrock.invoke_model(
        modelId="cohere.embed-multilingual-v3",
        body=request_body
    )

    # 응답 파싱
    response_body = json.loads(response['body'].read())
    embeddings = response_body['embeddings'][0]

    return embeddings

def getRecommendedBookResult(diary):
    query = f"당신은 심리 분석가처럼 행동합니다.\n또한 당신은 모든 책에 대한 해박한 지식을 가지고 있습니다.\n아래의 일기를 읽어보고 글쓴이에게 어울릴만한 책을 추천해주시기 바랍니다.\n\n### 일기 ###\n{diary}"


    question_embedding = getQueyrEmbedding(query)
    
    query = {
        "knn": {
            "query_vector": question_embedding,
            "k": 3,
            "field": "content_vector"  # This remains the same, as it refers to the field in your index
        },
        "_source": ["text", "title", "url"],
        "size": 10
    }
    
    response = client.search(
        index="book_vector_index",
        body=query
    )
    
    return response['hits']['hits']

def getRecommendedMovieResult(diary):
    query = f"당신은 심리 분석가처럼 행동합니다.\n또한 당신은 모든 영화에 대한 해박한 지식을 가지고 있습니다.\n아래의 일기를 읽어보고 글쓴이에게 위로가 될만한, 혹은 도움이 될만한 힐링 영화를 추천해주시기 바랍니다.\n\n### 일기 ###\n{diary}"


    question_embedding = getQueyrEmbedding(query)
    
    query = {
        "knn": {
            "query_vector": question_embedding,
            "k": 3,
            "field": "overview_vector"  # This remains the same, as it refers to the field in your index
        },
        "_source": ["text", "title", "url"],
        "size": 3
    }
    
    response = client.search(
        index="movie_vector_index",
        body=query
    )
    
    
    top_hit_summary = response['hits']['hits'][0]['_source']['text']
    
    for row in response['hits']['hits']:
        row['_source']['traslated_text'] = getTraslation(row['_source']['text'])
        
    return [row['_source'] for row in response['hits']['hits']]


def diary2image(
    diary_entry,
    summarize=True,
    api_key=API_KEY,
    text_model="gpt-4o-mini",
    image_model="dall-e-2",
    image_quality="standard",
    image_style="In oil painting style.",
    size="512x512",
):
    client = OpenAI(api_key=api_key)
    # diary_entry = getTraslation(diary_entry)
    if summarize:
        response = client.chat.completions.create(
            model=text_model,
            messages=[
                {"role": "user", "content": f"Please change the text below to an simple English prompt for image generation.\n\n(1){image_style}\n(Today's Feeling) {diary_entry}"}
            ],
        )
        diary_summary = response.choices[0].message.content
    else:
        diary_summary = diary_entry

    response = client.images.generate(
        model=image_model,
        prompt=f"{diary_summary} ",
        size=size,
        quality=image_quality,
        n=1,
    )

    image_url = response.data[0].url

    return image_url


def getRecommendedMusicResult(diary):
    query = f"당신은 심리 분석가처럼 행동합니다.\n또한 당신은 모든 음악에 대한 해박한 지식을 가지고 있습니다.\n아래의 일기를 읽어보고 글쓴이에게 위로가 될만한, 혹은 도움이 될만한 음악을 추천해주시기 바랍니다.\n\n### 일기 ###\n{diary}"


    question_embedding = getQueyrEmbedding(query)
    
    query = {
        "knn": {
            "query_vector": question_embedding,
            "k": 3,
            "field": "lyrics_vector"  # This remains the same, as it refers to the field in your index
        },
        "_source": ["title", "youtube_embed"],
        "size": 3
    }
    
    response = client.search(
        index="music_vector_index",
        body=query
    )
    
    return [row['_source'] for row in response['hits']['hits']]