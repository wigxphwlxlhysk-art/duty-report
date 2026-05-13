// ข้อมูลรายชื่อเวรแต่ละวัน 
const dutyData = {
    1: { day: "วันจันทร์", names: ["จูเนียร์", "เก้า", "ขันติ", "ออม", "เห็ดหอม", "พร้อม", "คริสตัล"] },
    2: { day: "วันอังคาร", names: ["นิว", "ยิ้ม", "ขวัญข้าว", "ออก้า", "กิ้บ", "แฮคกี้"] },
    3: { day: "วันพุธ", names: ["ยอด", "ไบเบิ้ล", "เจา", "อั่งเปา", "แมมมอส", "ต้า"] },
    4: { day: "วันพฤหัสบดี", names: ["พั้น", "ใส", "กิ๊บ"] },
    5: { day: "วันศุกร์", names: ["ปุ๋ย", "เนตร", "แพรวา", "เจิ้ล", "ใบ", "ภา", "อาชิ"] }
};

const today = new Date().getDay();
const dutyListBody = document.getElementById('duty-list');

if (today >= 1 && today <= 5) {
    const currentDuty = dutyData[today];
    let html = `<tr class="today-highlight"><td style="font-weight:bold; color:#0984e3;">${currentDuty.day}</td><td>`;
    currentDuty.names.forEach((name) => {
        html += `<label class="name-item"><input type="checkbox" class="attendance-check" value="${name}"><span>${name}</span></label>`;
    });
    html += `</td></tr>`;
    dutyListBody.innerHTML = html;
} else {
    dutyListBody.innerHTML = `<tr><td colspan="2" style="text-align:center; padding:20px;">🎉 วันนี้ไม่มีเวรครับ พักผ่อนให้เต็มที่!</td></tr>`;
}

async function sendReport() {
    const name = document.getElementById('senderName').value;
    const photoFiles = document.getElementById('photoInput').files;
    const statusDiv = document.getElementById('status');
    
    const token = "8664131894:AAH63X5-GjC8QkaIry-qvP5xwZ5IWgE-Nzo"; 
    const chatId = "-5263782545"; 

    const checkedNames = Array.from(document.querySelectorAll('.attendance-check:checked')).map(el => el.value);
    const allNames = dutyData[today] ? dutyData[today].names : [];
    const missingNames = allNames.filter(n => !checkedNames.includes(n));

    if (!name || photoFiles.length === 0) {
        alert("กรุณาระบุชื่อผู้รายงานและแนบรูปภาพด้วยครับ");
        return;
    }

    statusDiv.innerText = "กำลังส่งรายงาน...";

    const formData = new FormData();
    formData.append('chat_id', chatId);

    // จัดรูปแบบรายงานตามที่คุณต้องการ (เว้นวรรคและขึ้นบรรทัดใหม่)
    let reportText = `📝 รายงานการปฏิบัติหน้าที่\n`;
    reportText += `👤 ผู้ส่ง: ${name}\n\n`;
    reportText += `✅ มาทำเวร:\n\t${checkedNames.length > 0 ? checkedNames.join('\n\t') : 'ไม่มี'}\n\n`;
    reportText += `❌ ไม่มาทำ:\n\t${missingNames.length > 0 ? missingNames.join('\n\t') : 'ไม่มี'}\n\n`;
    reportText += `📅 วันที่: ${new Date().toLocaleDateString('th-TH')}\n`;
    reportText += `⏰ เวลา: ${new Date().toLocaleTimeString('th-TH')}`;

    const media = [];
    for (let i = 0; i < photoFiles.length; i++) {
        const fileId = `img_${i}`;
        formData.append(fileId, photoFiles[i]);
        media.push({
            type: 'photo',
            media: `attach://${fileId}`,
            caption: i === 0 ? reportText : ''
        });
    }

    formData.append('media', JSON.stringify(media));

    try {
        const response = await fetch(`https://api.telegram.org/bot${token}/sendMediaGroup`, {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            statusDiv.innerText = "✅ ส่งรายงานสำเร็จ!";
            alert("This case is closed"); //
            location.reload();
        } else {
            statusDiv.innerText = "❌ ส่งไม่สำเร็จ";
        }
    } catch (error) {
        statusDiv.innerText = "❌ เกิดข้อผิดพลาด";
    }
}
