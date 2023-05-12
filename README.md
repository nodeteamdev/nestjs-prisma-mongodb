# Development
1. Create volume
```
docker volume create --name mongodb_repl_data1 -d local
docker volume create --name mongodb_repl_data2 -d local
docker volume create --name mongodb_repl_data3 -d local
```
2. Start the Docker containers
```
docker-compose up -d
```
3. Start an interactive MongoDb shell
```
docker exec -it mongo0 mongo --port 30000
```
4.  Configure the replica set
```
config={"_id":"rs0","members":[{"_id":0,"host":"mongo0:30000"},{"_id":1,"host":"mongo1:30001"},{"_id":2,"host":"mongo2:30002"}]}
```
5. Update hosts
```
sudo nano  /etc/hosts
127.0.0.1 mongo0 mongo1 mongo2
```
6. Initiate the replica set
```
rs.initiate(config);
```
7. Result
```
mongo "mongodb://localhost:30000,localhost:30001,localhost:30002/?replicaSet=rs0"
