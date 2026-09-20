const admin = require('firebase-admin');
const { token } = require('morgan');

let firebaseApp;

const initFirebase = ()=>{
    if(!firebaseApp){
        firebaseApp = admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                privateKey:process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                clientEmail:process.env.FIREBASE_CLIENT_EMAIL
            })
        })
    }
    return admin.messaging();
}

exports.sendNotification = async(news,tokens)=>{
    if(!tokens || tokens.length === 0  ) return;
    const messaging = initFirebase()
    const message = {
        notification:{
            title : `Colours weekly - new news`,
            body: news.title.substring(0,100)
        },
        date:{
            newsId : news._id.toString(),
            slug: news.slug,
            category: news.category,
            url:`${process.env.FRONTEND_URL}/news/${news.slug}`
        },
        tokens:{
            tokens : token.slice(0,500)
        }
    };

    try {
        const response = await messaging.sendEachForMulticast(message);
        console.log(`${response.successCount} notification sent`);
        return response
        
    } catch (error) {
        console.error("notification error",error);
        
    }
}

exports.subscribeToTopic = async (token, topic) =>{
    const messaging  = initFirebase()
    return messaging.subscribeToTopic(token, topic)
}

exports.sendNotification = async (topic,title, body, data = {})=>{
    const messaging = initFirebase()
    return messaging.send({notification:{title, body}, data, topic})
}

// const firebaseConfig = {
//   apiKey: "AIzaSyA2C9i_mqZacHoRFVnyJSO5RcKZ53goRPw",
//   authDomain: "colors-weekly.firebaseapp.com",
//   projectId: "colors-weekly",
//   storageBucket: "colors-weekly.firebasestorage.app",
//   messagingSenderId: "816110710433",
//   appId: "1:816110710433:web:68d012d608f8a5531e4ae0",
//   measurementId: "G-QB5MFH4NHW"
// };