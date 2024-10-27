import os
import re
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import List
from googleSearch import google_search
from duckduckgoSearch import duckduckgo_search
from searchIcons import makeUnitypackageFile, settingFolderIcon

app = FastAPI()

origins = [
    'http://wails.localhost:34115',
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if not os.path.isdir('Images'):
    os.mkdir('Images')
if not os.path.isdir('Avaters'):
    os.mkdir('Avaters')

app.mount("/Images", StaticFiles(directory="Images"), name="Images")

@app.post("/image/get/{apiName}")
async def getImage(request: Request, apiName: str):
    json = await request.json()
    folderInformationList = []
    # todo
    # エクスプローラーの表示方法を変えれるか調べる 大アイコン、特大アイコンなど
    homeDirectory = os.path.expanduser("~")
    searchFolderPath = Path(homeDirectory) / "Downloads" # todo フロントエンドの設定画面などでどのフォルダを検索する対象にするか選べるようにする
    filePathList = list(searchFolderPath.rglob("*.unitypackage"))
    pattern = r"(_ver|ver|_|-v|_v)\d+(\.\d+)*|\.unitypackage$"

    for index, path in enumerate(filePathList):
        if index + 1 == 100: break
        cleaned = re.sub(pattern, "", os.path.basename(str(path)))
        cleanedPath = cleaned.replace("_"," ")
        subdirname = os.path.join(str(searchFolderPath), os.path.basename(os.path.dirname(path)))
        folderInformationList.append({'fullPath': str(path), 'path': cleaned, 'subPath': cleanedPath,'subdirname': subdirname})

    if apiName == 'google':
        returnInformationList = google_search(folderInformationList)
    else:
        returnInformationList = duckduckgo_search(folderInformationList)
    
    existedPaths = []
    notExistedPaths = []
    
    for object in returnInformationList:
        if 'url' in object:
            existedPaths.append(object)
        else:
            notExistedPaths.append(object)
    return {
        "existedPaths":
            existedPaths
        ,
        "notExistedPaths":
            notExistedPaths
        ,
    }

@app.post("/thumbnail")
async def settingThumbnail(ThumbnailList: List[dict]):
    print(ThumbnailList)
    imagefile = './Images/'
    for file in ThumbnailList:
        settingFolderIcon(os.path.join(imagefile, file['path'] + '.png'), file['path'], file['subdirname'], makeUnitypackageFile(file['subdirname']))
    return{"status": "Success"}