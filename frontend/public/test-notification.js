// Test Notification Manually in Browser Console
// Copy & paste vào Console (F12) khi đang ở trang Dashboard

console.log('🧪 Testing Notification System...\n');

// Test 1: Check if Notification API is supported
console.log('1️⃣ Checking Notification API support...');
if ('Notification' in window) {
  console.log('✅ Notification API is supported');
  console.log('📊 Current permission:', Notification.permission);
} else {
  console.error('❌ Notification API is NOT supported in this browser');
}

// Test 2: Request permission (if needed)
console.log('\n2️⃣ Checking permission...');
if (Notification.permission === 'default') {
  console.log('⚠️ Permission not set. Requesting...');
  Notification.requestPermission().then(permission => {
    console.log('📊 New permission:', permission);
  });
} else if (Notification.permission === 'granted') {
  console.log('✅ Permission already granted');
} else {
  console.log('❌ Permission denied');
}

// Test 3: Show test notification
console.log('\n3️⃣ Showing test notification...');
if (Notification.permission === 'granted') {
  const notification = new Notification('🧪 Test Notification', {
    body: 'Nếu bạn thấy thông báo này, notification đang hoạt động tốt!',
    icon: '/vite.svg',
    tag: 'test-notification',
    requireInteraction: false
  });

  notification.onclick = () => {
    console.log('✅ Notification clicked!');
    window.focus();
    notification.close();
  };

  setTimeout(() => {
    notification.close();
    console.log('✅ Notification auto-closed');
  }, 5000);

  console.log('✅ Test notification sent!');
} else {
  console.warn('⚠️ Cannot show notification. Permission:', Notification.permission);
}

// Test 4: Check localStorage
console.log('\n4️⃣ Checking localStorage...');
const dismissed = localStorage.getItem('notification-banner-dismissed');
console.log('📊 Banner dismissed:', dismissed);

// Test 5: Summary
console.log('\n📊 SUMMARY:');
console.log('├─ API Support:', 'Notification' in window ? '✅' : '❌');
console.log('├─ Permission:', Notification.permission);
console.log('├─ Banner dismissed:', dismissed || 'false');
console.log('└─ Ready:', Notification.permission === 'granted' ? '✅ YES' : '⚠️ NO');

console.log('\n💡 TIP: If permission is "denied", go to browser settings and enable notifications for this site.');
