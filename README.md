vercel serverless functionsで色々やるレポジトリ（自分用）  
apiフォルダ配下がserverless functionsのAPIエンドポイントとなる。  

## index.js / pin.js / top-langs.js

以下のレポジトリのコピー  
[![Readme Card](https://github-readme-stats.vercel.app/api/pin/?username=anuraghazra&repo=github-readme-stats&show_owner=true)](https://github.com/anuraghazra/github-readme-stats)  

## protopedia.js

ProtoPediaのユーザー情報を抽出してShields IOにインプットし、タグを出力  
ProtoPedia APIのlimit値はデフォルトで1000としている、limit=で変更可能。    

```HTML
[![ProtoPedia posts]https://vercel-serverless-functions-henna.vercel.app/api/protopedia?username=<username>&post=true](https://protopedia.net/prototyper/<username>)
[![ProtoPedia views]https://vercel-serverless-functions-henna.vercel.app/api/protopedia?username=<username>&view=true](https://protopedia.net/prototyper/<username>)
[![ProtoPedia good]https://vercel-serverless-functions-henna.vercel.app/api/protopedia?username=<username>&good=true](https://protopedia.net/prototyper/<username>)
```

[![ProtoPedia posts](https://vercel-serverless-functions-henna.vercel.app/api/protopedia?username=yamaccu&post=true)](https://protopedia.net/prototyper/yamaccu)
[![ProtoPedia views](https://vercel-serverless-functions-henna.vercel.app/api/protopedia?username=yamaccu&view=true)](https://protopedia.net/prototyper/yamaccu)
[![ProtoPedia good](https://vercel-serverless-functions-henna.vercel.app/api/protopedia?username=yamaccu&good=true)](https://protopedia.net/prototyper/yamaccu)