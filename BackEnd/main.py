from typing import Optional
from fastapi import FastAPI, File, Form, UploadFile, HTTPException, Header, Request, Query
from fastapi.responses import FileResponse
from pydantic import BaseModel
from elasticsearch import Elasticsearch
from datetime import datetime
from pytz import timezone
import random
import shutil
import os
from utils import *
from fastapi.middleware.cors import CORSMiddleware
from elasticsearch import Elasticsearch
from datetime import datetime

app = FastAPI()

# CORS 미들웨어 추가
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 origin 허용 (프로덕션에서는 특정 origin만 허용하는 것이 좋습니다)
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메소드 허용
    allow_headers=["*"],  # 모든 HTTP 헤더 허용
)

es = Elasticsearch(IP)

class ContentInput(BaseModel):
    date: str
    content: str

@app.post("/diary/post")
async def create_entry(
    content: str = Form(...),
    date: str = Form(...),
    feeling: str = Form(...),  # feeling을 필수 매개변수로 추가
    photo: Optional[UploadFile] = File(None)
):
    try:
        KST = timezone('Asia/Seoul')
        upload_dir = "./path/to"
        os.makedirs(upload_dir, exist_ok=True)
        file_location = f"{upload_dir}/{date}"

        # 사진 처리
        if photo:
            # 실제 파일 저장 경로 설정
            with open(file_location, "wb+") as file_object:
                shutil.copyfileobj(photo.file, file_object)
            photo_path = file_location
        else:
            img_url = diary2image(content)
            status_code = download_image(img_url, f"{file_location}.jpg")
            if status_code != 200:
                raise Exception(f"이미지 다운로드 실패. 상태 코드: {status_code}")
            photo_path = f"{file_location}.jpg"

        doc = {
            "content": content,
            "feeling": feeling,  # feeling을 문서에 추가
            "timestamp": datetime.now().astimezone(KST).isoformat(),
            "photo": photo_path,
            "recommended_book": getRecommendedBookResult(content),
            "recommended_music": getRecommendedMusicResult(content),
            "recommended_movie": getRecommendedMovieResult(content)
        }
        
        res = es.index(index="diary", id=date, body=doc)
        doc['photo'] =f'IP/diary/image/{date}'

        return {"message": "Entry created successfully", "doc": doc}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/diary/image/{date}")
async def get_diary_image(date: str):
    file_path = f"./path/to/{date}.jpg"
    if os.path.exists(file_path):
        return FileResponse(file_path)
    else:
        raise HTTPException(status_code=404, detail="Image not found")

@app.get("/diary/get")
async def get_diary(date: str = Query(..., description="Date in YYYYMMDD format")):
    if not date:
        raise HTTPException(status_code=400, detail="Missing date query parameter. Format should be YYYYMMDD.")
    
    # 날짜 형식 검증
    try:
        datetime.strptime(date, "%Y%m%d")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYYMMDD.")

    try:
        # Elasticsearch에서 데이터 조회
        result = es.get(index="diary", id=date)
        
        if result['found']:
            return {
                "message": "Diary entry found",
                "data": result['_source']
            }
        else:
            raise HTTPException(status_code=404, detail="Diary entry not found")
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        
@app.get("/diary/get/all")
async def get_all_diary(size: int = 10, from_: int = 0):
    try:
        # 모든 문서를 가져오는 쿼리
        query = {
            "query": {
                "match_all": {}
            },
            "from": from_,
            "size": size
        }

        # Elasticsearch에서 데이터 조회
        result = es.search(index="diary", body=query)
        
        # 결과 처리
        total_hits = result['hits']['total']['value']
        documents = {hit['_id']:hit['_source']['feeling'] for hit in result['hits']['hits']}

        return {
            "message": f"Retrieved {len(documents)} diary entries",
            "total": total_hits,
            "data": documents
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))