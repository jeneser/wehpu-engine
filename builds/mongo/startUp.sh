#!/bin/bash

set -x

MONGO_LOG="/var/log/mongodb/mongod.log"
MONGO="/usr/bin/mongo"
MONGOD="/usr/bin/mongod"

$MONGOD --fork --replSet wehpu --noprealloc --smallfiles --dbpath /data/db --logpath $MONGO_LOG

if [ "$ROLE" == "mongodb-master" ]
then
$MONGO --eval "rs.initiate({
	_id: \"wehpu\",
	version: 1,
	members: [
		{
			_id: 0,
			host: \"mongodb-master:27017\",
			arbiterOnly: false,
			buildIndexes: true,
			hidden: false,
			priority: 1,
			tags: {},
			slaveDelay: 0,
			votes: 1
		},
		{
			_id: 1,
			host: \"mongodb-slave1:27017\",
			arbiterOnly: false,
			buildIndexes: true,
			hidden: false,
			priority: 1,
			tags: {},
			slaveDelay: 0,
			votes: 1
		},
		{
			_id: 2,
			host: \"mongodb-slave2:27017\",
			arbiterOnly: false,
			buildIndexes: true,
			hidden: false,
			priority: 1,
			tags: {},
			slaveDelay: 0,
			votes: 1
		}
	]
})"
fi
tailf /dev/null