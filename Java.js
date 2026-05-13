// ไฮไลท์วันปัจจุบัน
const today = new Date().getDay();
if (today >= 1 && today <= 5) {
    const row = document.getElementById(`d-${today}`);
    if (row) row.className = 'today-highlight';
}

async function sendReport() {
    const name = document.getElementById('senderName').value;
    const photoFiles = document.getElementById('photoInput').files;
    const statusDiv = document.getElementById('status');

    const token = "8664131894:AAH63X5-GjC8QkaIry-qvP5xwZ5IWgE-Nzo"; 
    const chatId = "7541921308"; 

    if (!name || photoFiles.length === 0) {
        alert("กรุณาระบุชื่อและแนบรูปภาพอย่างน้อย 1 รูปครับ");
        return;
    }

    statusDiv.innerText = "กำลังส่งข้อมูลแบบอัลบั้ม...";
    statusDiv.style.color = "#666";

    const formData = new FormData();
    formData.append('chat_id', chatId);

    const media = [];
    for (let i = 0; i < photoFiles.length; i++) {
        const fileId = `img_${i}`;
        formData.append(fileId, photoFiles[i]);
        
        media.push({
            type: 'photo',
            media: `attach://${fileId}`,
            // ใส่ข้อความรายงานไว้ที่รูปแรก
            caption: i === 0 ? `✅ รายงานส่งเวรเรียบร้อย\n👤 ผู้ส่ง: ${name}\n📅 วันที่: ${new Date().toLocaleDateString('th-TH')}\n⏰ เวลา: ${new Date().toLocaleTimeString('th-TH')}` : ''
        });
    }

    formData.append('media', JSON.stringify(media));

    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/sendMediaGroup`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            statusDiv.innerText = "✅ ส่งสำเร็จ!";
            statusDiv.style.color = "#28a745";
            alert("This case is closed"); 
            location.reload();
        } else {
            statusDiv.innerText = "❌ ส่งไม่สำเร็จ (ไฟล์อาจใหญ่เกินไป)";
            statusDiv.style.color = "#dc3545";
        }
    } catch (error) {
        statusDiv.innerText = "❌ ไม่สามารถเชื่อมต่อระบบได้";
        statusDiv.style.color = "#dc3545";
    }
}