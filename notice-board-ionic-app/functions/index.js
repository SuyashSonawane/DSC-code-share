const functions = require('firebase-functions');
const admin = require('firebase-admin')
admin.initializeApp()
exports.subscribeToTopic = functions.https.onCall(
    async (data, context) => {
      await admin.messaging().subscribeToTopic(data.token, data.topic);
  
      return `subscribed to ${data.topic}`;
    }
  );
  
  exports.unsubscribeFromTopic = functions.https.onCall(
    async (data, context) => {
      await admin.messaging().unsubscribeFromTopic(data.token, data.topic);
  
      return `unsubscribed from ${data.topic}`;
    }
  );

  exports.sendOnFirestoreCreate = functions.firestore
  .document('notices/{noticeId}')
  .onCreate(async (snapshot,context) => {
    const notice = snapshot.data()
    const noticeId = snapshot.ref.parent.key
    console.log(snapshot.data(), snapshot.ref.parent.key)

    const notification = {
      title: 'New Notice Added',
      body: notice.body
    };

    const payload= {
        notification,
        webpush: {
          notification: {
            vibrate: [200, 100, 200],
            icon: 'https://placeimg.com/250/250/people',
            // actions: [
            //   {
            //     action: 'like',
            //     title: '👍 Yaaay!'
            //   },
            //   {
            //     action: 'dislike',
            //     title: 'Boooo!'
            //   }
            // ]
          }
        },
        topic: 'discounts'
      };

    return admin.messaging().send(payload);
  });