const { MongoClient } = require('mongodb');

MongoClient.connect('mongodb://127.0.0.1:27017/').then(c => {
    const db = c.db('medsync');
    db.collection('appointments').updateMany(
        { 'docData.image': { $regex: 'prescripto' } },
        { $set: { 'docData.image': 'https://randomuser.me/api/portraits/men/44.jpg' } }
    ).then(res => {
        console.log('Updated:', res.modifiedCount);
        process.exit(0);
    });
}).catch(err => {
    console.error(err);
    process.exit(1);
});
