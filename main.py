import os
import re
from pathlib import Path
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from typing import List
from googleSearch import google_search
from duckduckgoSearch import duckduckgo_search



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

app.mount("/Images", StaticFiles(directory="Images"), name="Images")
"""
    @app.post("/duckduckgo")
def search_duckduckgo(pathList: List[dict]):
    print(pathList)
    return duckduckgo_search(pathList)

@app.post("/google")
def search_google(pathList: List[dict]):
    print(pathList)
    return google_search(pathList)
"""


@app.post("/image/get/{apiName}")
async def getImage(request: Request, apiName: str):
    json = await request.json()
    folderInformationList = []
    # todo
    # ダウンローフォルダ内から.unitypackageがふくまれているフォルダを検索するプログラムをかく
    # jsxに保存されているimagesというフォルダの中身を全部返す
    # これ ↓
    # target = f"D:\Codes\App\imageGetterSample\img\{json['target']}.png"
    # ./images/a.png 
    # 辞書型であった場合はexisted[]
    # forで回す
    # エクスプローラーの表示方法を変えれるか調べる 大アイコン、特大アイコンなど
    # リストの辞書型を作りそこにpathをいれる
    homeDirectory = os.path.expanduser("~")
    searchFolderPath = Path(homeDirectory) / "Downloads" # todo フロントエンドの設定画面などでどのフォルダを検索する対象にするか選べるようにする
    filePathList = list(searchFolderPath.rglob("*.unitypackage"))
    pattern = r"(_ver|ver|_|-v)\d+(\.\d+)*|\.unitypackage$"
    for index, path in enumerate(filePathList):
        if index + 1 == 100: break
        cleaned = re.sub(pattern, "", os.path.basename(str(path)))
        cleanedPath = cleaned.replace("_"," ")
        folderInformationList.append({'fullPath': str(path), 'path': cleanedPath})

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
    # target = ["C:\\Users\\youya\\Downloads\\hotogiya_Kuuta_ver1.03", "C:\\Users\\youya\\Downloads\\少年アリス服_Rusk_ver1.01", "..."]
    return {
        #すべて参照元のフォルダのpath,name,updatedを参照する
        #現在はダウンロードフォルダの.unitypackageが含まれているフォルダから参照する
        "existedPaths":
            existedPaths
        , #ここに画像が存在しているファイルのpathを返す
        "notExistedPaths":
            notExistedPaths
        , #ここに画像が存在していないファイルのpathを返す
    }