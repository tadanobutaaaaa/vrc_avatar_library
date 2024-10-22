import time
from duckduckgo_search import DDGS
from duckduckgo_search.exceptions import DuckDuckGoSearchException, RatelimitException
from fastapi import HTTPException
from searchIcons import SearchIcons
def duckduckgo_search(pathNameList):
    try:
        with DDGS() as ddgs:
            for name in pathNameList:
                try:
                    results = ddgs.text(
                        keywords=f'{name["path"]} site:booth.pm/ja/items/',
                        region='wt-wt',
                        safesearch='on',
                        timelimit=None,
                        max_results=1
                    )
                    name['url'] = results[0]["href"]
                    SearchIcons(name['url'], name['path'])
                    time.sleep(15)
                except RatelimitException as e:
                    print(f"エラーが発生しました: {e}")
                    raise HTTPException(status_code=429, detail="Rate limit exceeded",)
                except DuckDuckGoSearchException as e:
                    print(f"エラーが発生しました: {e}")
                    raise HTTPException(status_code=500, detail="Server Error",)
                except Exception as e:  # その他の予期しないエラー
                    print(f"予期しないエラーが発生しました: {e}")
                    raise HTTPException(status_code=500, detail="Unexpected Error")
    except Exception as e:
        print(f"インスタンスエラーが発生しました: {e}")
        raise HTTPException(status_code=500, detail="Instance Error")
    
    print(pathNameList)
    return pathNameList