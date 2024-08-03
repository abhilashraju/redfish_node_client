docker build -t proxy .
docker stop proxy ; docker rm proxy; docker run --network host --name proxy -p 3001:3001 -p 5000:5000 proxy 
