import os
from PIL import Image, ImageDraw, ImageFont

def render_code_card(output_path, title, code_lines):
    width = 960
    line_h = 24
    pad = 22
    header_h = 44
    height = header_h + (len(code_lines) * line_h) + (pad * 2)

    img = Image.new('RGB', (width, height), color=(15, 23, 42)) # Slate 900
    draw = ImageDraw.Draw(img)

    # Titlebar (Slate 800)
    draw.rectangle([0, 0, width, header_h], fill=(30, 41, 59))

    # Window dots
    draw.ellipse([18, 16, 28, 26], fill=(239, 68, 68))   # Red
    draw.ellipse([36, 16, 46, 26], fill=(245, 158, 11))  # Amber
    draw.ellipse([54, 16, 64, 26], fill=(16, 185, 129))  # Green

    # Window Title
    draw.text((86, 14), title, fill=(203, 213, 225))

    # Border
    draw.rectangle([0, 0, width - 1, height - 1], outline=(51, 65, 85), width=1)

    y = header_h + pad
    for i, line in enumerate(code_lines):
        line_no = f"{i + 1:2d}"
        draw.text((22, y), line_no, fill=(100, 116, 139)) # Slate 500

        # Syntax color heuristics
        text_color = (248, 250, 252) # White
        sline = line.strip()
        if sline.startswith(('//', '/*', '--', '*')):
            text_color = (148, 163, 184) # Comments slate
        elif any(sline.startswith(kw) for kw in ['import ', 'export ', 'const ', 'let ', 'function ', 'return ', 'CREATE ', 'PRIMARY ', 'REFERENCES ']):
            text_color = (56, 189, 248) # Cyan keywords
        elif any(kw in sline for kw in ['if (', 'else', 'for (', 'SELECT ', 'INSERT ']):
            text_color = (251, 146, 60) # Orange logic
        elif any(kw in sline for kw in ['<div', '</div', 'span', 'className']):
            text_color = (167, 139, 250) # Purple JSX

        draw.text((68, y), line, fill=text_color)
        y += line_h

    img.save(output_path, quality=95)
    print(f"[OK] Generated: {output_path}")

def generate_all_screenshots():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    
    # 1. Dates & Expiry
    render_code_card(os.path.join(base_dir, 'code_shot_dates.png'),
        'frontend/src/App.jsx - Real-Time Dynamic Date Scheduler & Show Expiry Engine', [
        '// Dynamic Real-Time Date Generator (Today + next 6 upcoming days)',
        'export const getDynamicDateOptions = () => {',
        '  const daysShort = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];',
        '  const monthsShort = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];',
        '  const list = [];',
        '  const today = new Date();',
        '  for (let i = 0; i < 7; i++) {',
        '    const d = new Date(today);',
        '    d.setDate(today.getDate() + i);',
        '    const dayName = daysShort[d.getDay()];',
        '    const dateNum = String(d.getDate()).padStart(2, "0");',
        '    const monthName = monthsShort[d.getMonth()];',
        '    list.push({ label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : `${dayName}, ${dateNum} ${monthName}` });',
        '  }',
        '  return list;',
        '};',
        '',
        '// Real-Time Clock Validation: Prevents booking concluded showtimes',
        'export const checkIsShowtimePast = (selectedDate, timeStr) => {',
        '  if (selectedDate !== "Today" || !timeStr) return false;',
        '  const match = timeStr.match(/(\\d+):(\\d+)\\s*(AM|PM)/i);',
        '  let [_, hours, minutes, ampm] = match;',
        '  hours = parseInt(hours, 10);',
        '  if (ampm.toUpperCase() === "PM" && hours < 12) hours += 12;',
        '  if (ampm.toUpperCase() === "AM" && hours === 12) hours = 0;',
        '  const showTime = new Date();',
        '  showTime.setHours(hours, parseInt(minutes, 10), 0, 0);',
        '  return new Date() > showTime;',
        '};'
    ])

    # 2. Seating Matrix
    render_code_card(os.path.join(base_dir, 'code_shot_seats.png'),
        'frontend/src/components/booking/SeatSelector.jsx - 3-Block 24-Seat Matrix', [
        '// 3-Block 24-Seat Physical Cinema Auditorium Layout (480 Seats Total)',
        '// Blocks: Left Block (01-06), Center Block (07-18), Right Block (19-24)',
        '// Tiers: Rows F-M (Balcony Premium Rs.190), Rows N-Y (Front Gold Rs.150)',
        'const renderAisleRow = (rowLabel) => {',
        '  const isPremium = ["F","G","H","J","K","L","M"].includes(rowLabel);',
        '  const price = isPremium ? 190.00 : 150.00;',
        '  return (',
        '    <div key={rowLabel} className="flex items-center justify-center gap-6 my-1.5">',
        '      <span className="w-6 font-bold text-slate-500 font-mono">{rowLabel}</span>',
        '      {/* Left Block (Seats 01 - 06) */}',
        '      <div className="flex gap-1.5">{renderBlock(rowLabel, 1, 6, price)}</div>',
        '      {/* Aisle 1 (Walking Corridor) */}',
        '      <div className="w-4 border-r border-dashed border-slate-300" />',
        '      {/* Center Block (Seats 07 - 18) */}',
        '      <div className="flex gap-1.5">{renderBlock(rowLabel, 7, 18, price)}</div>',
        '      {/* Aisle 2 (Walking Corridor) */}',
        '      <div className="w-4 border-r border-dashed border-slate-300" />',
        '      {/* Right Block (Seats 19 - 24) */}',
        '      <div className="flex gap-1.5">{renderBlock(rowLabel, 19, 24, price)}</div>',
        '    </div>',
        '  );',
        '};'
    ])

    # 3. Digital Ticket
    render_code_card(os.path.join(base_dir, 'code_shot_ticket.png'),
        'frontend/src/components/booking/DigitalTicket.jsx - Instant QR E-Ticket Generator', [
        '// Generate High-Resolution Digital E-Ticket with Embedded QR Code',
        'const drawTicketOnCanvas = (canvas, booking) => {',
        '  const ctx = canvas.getContext("2d");',
        '  ctx.fillStyle = "#0f172a"; // Cinema Slate Navy Header Bar',
        '  ctx.fillRect(0, 0, 800, 180);',
        '  ',
        '  // Header branding & Booking Ref ID',
        '  ctx.font = "bold 28px sans-serif";',
        '  ctx.fillStyle = "#ffffff";',
        '  ctx.fillText("CinePass Cinemas", 40, 75);',
        '  ctx.font = "bold 18px monospace";',
        '  ctx.fillStyle = "#f43f5e";',
        '  ctx.fillText(`BOOKING ID: ${booking.id}`, 560, 75);',
        '  ',
        '  // Movie Details, Audi Hall, and Confirmed Seats',
        '  ctx.fillStyle = "#0f172a";',
        '  ctx.font = "bold 24px sans-serif";',
        '  ctx.fillText(booking.movieTitle, 40, 260);',
        '  ctx.font = "16px sans-serif";',
        '  ctx.fillText(`Date: ${booking.date}  |  Showtime: ${booking.time}`, 40, 305);',
        '  ctx.fillText(`Confirmed Seats: ${booking.seats.join(", ")}`, 40, 345);',
        '  ctx.fillText(`Total Paid: Rs.${booking.totalAmount.toLocaleString()}`, 40, 385);',
        '};'
    ])

    # 4. REST API Backend
    render_code_card(os.path.join(base_dir, 'code_shot_api.png'),
        'backend/src/server.js - RESTful API & Concurrency Seat Lock Controller', [
        '// POST /api/bookings - Atomic Booking Transaction with Concurrency Lock',
        'app.post("/api/bookings", (req, res) => {',
        '  const { showtimeId, seats, customerName, totalAmount, paymentMethod } = req.body;',
        '  const db = readDb();',
        '  const showtime = db.showtimes.find(s => s.id === showtimeId);',
        '  if (!showtime) return res.status(404).json({ error: "Showtime not found" });',
        '  ',
        '  // Enforce Concurrency Lock: Prevent double booking of identical seats',
        '  const conflictSeats = seats.filter(seat => showtime.bookedSeats.includes(seat));',
        '  if (conflictSeats.length > 0) {',
        '    return res.status(409).json({ error: "Seats already reserved", conflictSeats });',
        '  }',
        '  ',
        '  // Lock seats and generate verified E-Ticket record',
        '  showtime.bookedSeats.push(...seats);',
        '  const newBooking = {',
        '    id: `CP-${Math.floor(10000 + Math.random() * 90000)}`,',
        '    showtimeId, seats, customerName, totalAmount, paymentMethod,',
        '    createdAt: new Date().toISOString(), status: "Confirmed"',
        '  };',
        '  db.bookings.unshift(newBooking);',
        '  writeDb(db);',
        '  return res.status(201).json({ success: true, booking: newBooking });',
        '});'
    ])

    # 5. Database Schema
    render_code_card(os.path.join(base_dir, 'code_shot_db.png'),
        'database/schema.sql - Relational DDL Table Specifications (MySQL / PostgreSQL)', [
        '-- 8-Table Relational Schema for Online Movie Ticket Booking System',
        'CREATE TABLE movies (',
        '    movie_id VARCHAR(20) PRIMARY KEY,',
        '    title VARCHAR(150) NOT NULL,',
        '    duration VARCHAR(20) NOT NULL,',
        '    certificate VARCHAR(10) NOT NULL,',
        '    genre VARCHAR(100) NOT NULL,',
        '    is_tamil BOOLEAN DEFAULT TRUE,',
        '    is_tamil_dubbed BOOLEAN DEFAULT FALSE',
        ');',
        'CREATE TABLE showtimes (',
        '    showtime_id VARCHAR(30) PRIMARY KEY,',
        '    movie_id VARCHAR(20) REFERENCES movies(movie_id),',
        '    show_date DATE NOT NULL,',
        '    show_time VARCHAR(20) NOT NULL,',
        '    price_premium DECIMAL(8,2) DEFAULT 190.00,',
        '    price_gold DECIMAL(8,2) DEFAULT 150.00',
        ');',
        'CREATE TABLE booking_seats (',
        '    id INT AUTO_INCREMENT PRIMARY KEY,',
        '    booking_id VARCHAR(30) NOT NULL,',
        '    showtime_id VARCHAR(30) REFERENCES showtimes(showtime_id),',
        '    seat_code VARCHAR(10) NOT NULL,',
        '    UNIQUE KEY unique_show_seat_lock (showtime_id, seat_code)',
        ');'
    ])

    # 6. Admin Occupancy Matrix
    render_code_card(os.path.join(base_dir, 'code_shot_admin.png'),
        'frontend/src/components/admin/AdminDashboard.jsx - Live Screen Occupancy Matrix', [
        '// Live 480-Seat Occupancy Visualizer for Cinema Operations',
        'export function renderAdminSeatMatrix(showtime) {',
        '  const totalSeats = 480;',
        '  const bookedCount = showtime.bookedSeats.length;',
        '  const availableCount = totalSeats - bookedCount;',
        '  const occupancyRate = ((bookedCount / totalSeats) * 100).toFixed(1);',
        '  const totalRevenue = showtime.bookedSeats.reduce((acc, seat) => {',
        '    const row = seat.charAt(0);',
        '    const price = ["F","G","H","J","K","L","M"].includes(row) ? 190 : 150;',
        '    return acc + price;',
        '  }, 0);',
        '  return {',
        '    bookedCount, availableCount, occupancyRate: `${occupancyRate}%`,',
        '    grossRevenue: `Rs.${totalRevenue.toLocaleString()}`',
        '  };',
        '}'
    ])

if __name__ == '__main__':
    generate_all_screenshots()
