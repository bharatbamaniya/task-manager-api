import {MongoClient, ObjectId}  from 'mongodb'

// Connection URI
const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

// const id = new ObjectID();
// console.log(id.toString());
// console.log(id.getTimestamp())

async function run() {
    const client = new MongoClient(connectionURL);
    try {
        // Connect to client to the server
        await client.connect();
        console.log('Connected successfully to server');

        const db = await client.db(databaseName);
        const users = await db.collection('users');

        // deleteOne
        // await users.deleteOne({
        //     name: 'Alan'
        // }).then(result=>{
        //     console.log(result)
        // }).catch(error=>{
        //     console.log(error)
        // })

        // deleteMany
        // await users.deleteMany({
        //     age: 25
        // }).then(result=>{
        //     console.log(result)
        // }).catch(error=>{
        //     console.log(error)
        // })

        // updateOne
        // await users.updateOne(
        //     {
        //         age: { $eq: 23 }
        //     },
        //     {
        //         $set: {
        //             name: 'Jane',
        //             age: 25
        //         }
        //     }
        // ).then((result) => {
        //     console.log(result)
        // }).catch((error) => {
        //     console.log(error)
        // });

        // updateMany
        // await users.updateMany(
        //     {
        //         age: { $eq: 23 }
        //     },
        //     {
        //         $set: {
        //             name: 'Jane',
        //             age: 25
        //         }
        //     }
        // ).then((result) => {
        //     console.log(result)
        // }).catch((error) => {
        //     console.log(error)
        // });

        // findOne
        // const result = await users.findOne({_id : new ObjectId("63314067111c17ffc36039e5")});
        // console.log(result)

        // find
        // const cursor = await users.find();
        // await cursor.forEach(console.log)

        // insertOne
        // await users.insertOne({
        //     // _id: id.toString(),
        //     name: 'Alan',
        //     age: 27
        // }).then(result => {
        //     console.log(result);
        // }).catch(error => {
        //     console.log('Unable to insert user | ' + error);
        // })

        // insertMany
        // await users.insertMany([{
        //     // _id: id.toString(),
        //     name: 'Jene',
        //     age: 24
        // },{
        //     name: 'Kumar',
        //     age: 54
        // },{
        //     name: 'Andrew',
        //     age: 23
        // }]).then(result => {
        //     console.log(result);
        // }).catch(error => {
        //     console.log('Unable to insert user | ' + error);
        // })

    } catch (e) {
        console.log('Something unexpected happened at the server | ' + e);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
}

run().catch(error => {
    console.log('Unable to connect to server | ' + error);
});
