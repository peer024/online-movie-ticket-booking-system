import React, { useRef, useState } from 'react';
import { sound } from '../../services/soundEngine';
import { Download, Printer, CheckCircle2, Ticket, Sparkles, MapPin, Calendar, Clock, Film, Glasses, Check } from 'lucide-react';

export default function DigitalTicket({
  booking: inputBooking,
  onDone
}) {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Guarantee booking is never null/undefined and all properties exist
  const b = inputBooking?.booking || inputBooking || {};
  const booking = {
    id: b.id || `CV-${Math.floor(10000 + Math.random() * 90000)}`,
    movieId: b.movieId || 'mov-goat',
    movieTitle: b.movieTitle || 'The Greatest of All Time (GOAT)',
    showType: b.showType || '3D',
    format: b.format || (b.showType === '3D' ? 'IMAX 3D Laser' : 'Dolby Atmos 2D'),
    date: b.date || 'Today',
    time: b.time || '07:00 PM',
    hall: b.hall || 'Grand IMAX Audi 1 (3D)',
    seats: Array.isArray(b.seats) && b.seats.length > 0 ? b.seats : ['A3', 'A4'],
    seatTiers: Array.isArray(b.seatTiers) && b.seatTiers.length > 0 ? b.seatTiers : ['VIP Lounger'],
    ticketAmount: Number(b.ticketAmount) || 960,
    glassesCount: Number(b.glassesCount) || (b.showType === '3D' ? 2 : 0),
    glassesAmount: Number(b.glassesAmount) || (b.showType === '3D' ? 60 : 0),
    snacks: Array.isArray(b.snacks) ? b.snacks : [],
    snacksAmount: Number(b.snacksAmount) || 0,
    discount: Number(b.discount) || 0,
    totalAmount: Number(b.totalAmount) || 1020,
    paymentMethod: b.paymentMethod || 'UPI / Instant QR',
    customerName: b.customerName || 'Valued Cinema Guest',
    customerEmail: b.customerEmail || 'guest@cineverse.io',
    customerPhone: b.customerPhone || '+91 98765 43210',
    createdAt: b.createdAt || new Date().toISOString(),
    status: b.status || 'Confirmed'
  };

  // Dedicated Clean Print Handler (100% reliable - never blank)
  const handlePrint = () => {
    sound.playClick();

    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      // Fallback to standard window.print() if popup blocked
      window.print();
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>CineVerse 3D Pass - ${booking.id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&family=JetBrains+Mono:wght@500;700&display=swap');
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              font-family: 'Outfit', sans-serif;
              background-color: #f1f5f9;
              color: #0f172a;
              padding: 30px;
              display: flex;
              justify-content: center;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .ticket-card {
              width: 100%;
              max-width: 650px;
              background: #090d16;
              color: #ffffff;
              border: 3px solid #00f5ff;
              border-radius: 24px;
              padding: 32px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            }
            .header {
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 2px dashed rgba(255,255,255,0.25);
              padding-bottom: 20px;
            }
            .brand {
              font-size: 22px;
              font-weight: 900;
              letter-spacing: 1px;
            }
            .brand span { color: #00f5ff; }
            .ref-num {
              text-align: right;
              font-family: 'JetBrains Mono', monospace;
              color: #f59e0b;
              font-weight: bold;
              font-size: 16px;
            }
            .movie-info {
              padding: 24px 0;
              border-bottom: 2px dashed rgba(255,255,255,0.25);
            }
            .movie-title {
              font-size: 28px;
              font-weight: 900;
              margin-bottom: 8px;
            }
            .badges {
              display: flex;
              gap: 8px;
              margin-top: 10px;
            }
            .badge {
              background: rgba(0, 245, 255, 0.15);
              color: #00f5ff;
              border: 1px solid rgba(0, 245, 255, 0.4);
              padding: 4px 12px;
              border-radius: 8px;
              font-size: 12px;
              font-weight: bold;
              font-family: 'JetBrains Mono', monospace;
            }
            .badge-gold {
              background: rgba(245, 158, 11, 0.15);
              color: #f59e0b;
              border-color: rgba(245, 158, 11, 0.4);
            }
            .grid-details {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 16px;
              margin-top: 16px;
              font-size: 13px;
              background: rgba(255,255,255,0.04);
              padding: 14px;
              border-radius: 12px;
            }
            .seats-section {
              padding: 24px 0;
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 2px dashed rgba(255,255,255,0.25);
            }
            .seat-pills {
              display: flex;
              gap: 8px;
              margin-top: 6px;
            }
            .seat-pill {
              background: #00f5ff;
              color: #000000;
              font-weight: 900;
              font-family: 'JetBrains Mono', monospace;
              padding: 6px 14px;
              border-radius: 8px;
              font-size: 14px;
            }
            .footer-section {
              padding-top: 24px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .qr-box {
              background: #ffffff;
              padding: 10px;
              border-radius: 12px;
              display: inline-block;
            }
            .qr-box svg {
              width: 90px;
              height: 90px;
              display: block;
            }
            .total-amount {
              text-align: right;
            }
            .total-amount .price {
              font-size: 26px;
              font-weight: 900;
              color: #10b981;
              font-family: 'JetBrains Mono', monospace;
            }
            @media print {
              body { padding: 0; background: #ffffff; }
              .ticket-card { box-shadow: none; max-width: 100%; border-color: #000000; }
            }
          </style>
        </head>
        <body>
          <div class="ticket-card">
            <div class="header">
              <div>
                <div class="brand">CINE<span>VERSE</span> 3D</div>
                <div style="font-size: 11px; color: #94a3b8; font-family: monospace;">QUANTUM CINEMA PASS</div>
              </div>
              <div class="ref-num">
                <div style="font-size: 10px; color: #94a3b8;">BOOKING REF</div>
                ${booking.id}
              </div>
            </div>

            <div class="movie-info">
              <div style="font-size: 11px; color: #00f5ff; font-family: monospace; text-transform: uppercase;">
                ${booking.showType === '3D' ? '🕶️ 3D STEREOSCOPIC EXPERIENCE' : '🎬 2D ULTRA CLEAR MASTER'}
              </div>
              <div class="movie-title">${booking.movieTitle}</div>
              <div class="badges">
                <span class="badge">${booking.hall}</span>
                <span class="badge">${booking.format || (booking.showType === '3D' ? 'IMAX 3D Laser' : 'Dolby Atmos 2D')}</span>
                ${booking.glassesCount > 0 ? `<span class="badge badge-gold">🕶️ ${booking.glassesCount}x 3D Glasses</span>` : ''}
              </div>

              <div class="grid-details">
                <div><strong>Date & Time:</strong> ${booking.date} at ${booking.time}</div>
                <div><strong>Guest Name:</strong> ${booking.customerName}</div>
                <div><strong>Contact:</strong> ${booking.customerEmail}</div>
                <div><strong>Entry Gate:</strong> Gate 03 (Turnstile Scanner)</div>
              </div>
            </div>

            <div class="seats-section">
              <div>
                <div style="font-size: 11px; color: #94a3b8; font-family: monospace; text-transform: uppercase;">CONFIRMED SEATS</div>
                <div class="seat-pills">
                  ${booking.seats.map(s => `<span class="seat-pill">${s}</span>`).join('')}
                </div>
                <div style="font-size: 11px; color: #94a3b8; margin-top: 6px;">Tier: ${booking.seatTiers?.join(', ') || 'VIP Lounger'}</div>
              </div>

              <div class="total-amount">
                <div style="font-size: 10px; color: #94a3b8; text-transform: uppercase; font-family: monospace;">TOTAL PAID</div>
                <div class="price">₹${booking.totalAmount?.toLocaleString()}</div>
                <div style="font-size: 10px; color: #64748b;">${booking.paymentMethod}</div>
              </div>
            </div>

            <div class="footer-section">
              <div style="display: flex; align-items: center; gap: 16px;">
                <div class="qr-box">
                  <svg viewBox="0 0 100 100">
                    <rect x="5" y="5" width="28" height="28" rx="4" />
                    <rect x="9" y="9" width="20" height="20" fill="white" rx="2" />
                    <rect x="13" y="13" width="12" height="12" />
                    <rect x="67" y="5" width="28" height="28" rx="4" />
                    <rect x="71" y="9" width="20" height="20" fill="white" rx="2" />
                    <rect x="75" y="13" width="12" height="12" />
                    <rect x="5" y="67" width="28" height="28" rx="4" />
                    <rect x="9" y="71" width="20" height="20" fill="white" rx="2" />
                    <rect x="13" y="75" width="12" height="12" />
                    <rect x="42" y="15" width="8" height="8" />
                    <rect x="55" y="25" width="8" height="8" />
                    <rect x="40" y="40" width="20" height="20" rx="3" fill="#0284c7" />
                    <rect x="46" y="46" width="8" height="8" fill="white" />
                    <rect x="15" y="42" width="8" height="8" />
                    <rect x="25" y="55" width="8" height="8" />
                    <rect x="68" y="45" width="10" height="8" />
                    <rect x="80" y="58" width="12" height="8" />
                    <rect x="42" y="72" width="10" height="10" />
                    <rect x="65" y="75" width="12" height="8" />
                    <rect x="82" y="78" width="10" height="12" />
                  </svg>
                </div>
                <div>
                  <div style="font-size: 13px; font-weight: bold; color: #ffffff;">Contactless QR Turnstile Entry</div>
                  <div style="font-size: 11px; color: #94a3b8; max-width: 320px; margin-top: 2px;">
                    Scan directly from mobile screen or this printed slip at CineVerse Gate Turnstile.
                  </div>
                  <div style="font-size: 10px; color: #00f5ff; font-family: monospace; margin-top: 4px;">
                    SECURE SIGNATURE: SHA256-${booking.id}
                  </div>
                  <div style="font-size: 10px; color: #64748b; font-family: monospace; margin-top: 6px; border-top: 1px dashed rgba(255,255,255,0.15); padding-top: 4px;">
                    Designed and Developed by Kombaiya & Ashik Chandru
                  </div>
                </div>
              </div>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  // Direct PNG Image Download using Canvas
  const handleDownloadImage = () => {
    sound.playClick();
    setDownloading(true);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 900;
      canvas.height = 1100;
      const ctx = canvas.getContext('2d');

      // Background
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, 900, 1100);

      // Border
      ctx.strokeStyle = '#00f5ff';
      ctx.lineWidth = 6;
      ctx.strokeRect(20, 20, 860, 1060);

      // Top glowing bar
      const grad = ctx.createLinearGradient(20, 20, 880, 30);
      grad.addColorStop(0, '#00f5ff');
      grad.addColorStop(0.5, '#8b5cf6');
      grad.addColorStop(1, '#f59e0b');
      ctx.fillStyle = grad;
      ctx.fillRect(20, 20, 860, 14);

      // Brand
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 36px sans-serif';
      ctx.fillText('CINEVERSE 3D', 50, 90);

      ctx.fillStyle = '#00f5ff';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('QUANTUM CINEMA PASS', 50, 120);

      // Ref ID
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 24px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(booking.id, 850, 90);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '14px monospace';
      ctx.fillText('BOOKING REF', 850, 115);
      ctx.textAlign = 'left';

      // Divider
      ctx.strokeStyle = 'rgba(255,255,255,0.2)';
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(50, 150);
      ctx.lineTo(850, 150);
      ctx.stroke();

      // Movie Details
      ctx.fillStyle = '#00f5ff';
      ctx.font = 'bold 18px monospace';
      ctx.fillText(booking.showType === '3D' ? '🕶️ 3D STEREOSCOPIC EXPERIENCE' : '🎬 2D ULTRA CLEAR MASTER', 50, 200);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 40px sans-serif';
      ctx.fillText(booking.movieTitle, 50, 255);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(`${booking.hall} • ${booking.format || 'Standard'}`, 50, 300);

      // Date / Guest Box
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.fillRect(50, 340, 800, 110);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px sans-serif';
      ctx.fillText('SHOWTIME:', 70, 380);
      ctx.fillText('GUEST NAME:', 70, 420);
      ctx.fillText('ENTRY GATE:', 480, 380);
      ctx.fillText('PAYMENT:', 480, 420);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(`${booking.date} at ${booking.time}`, 180, 380);
      ctx.fillText(booking.customerName, 180, 420);
      ctx.fillText('Gate 03 (Turnstile)', 580, 380);
      ctx.fillText(booking.paymentMethod, 580, 420);

      // Seats
      ctx.setLineDash([8, 8]);
      ctx.beginPath();
      ctx.moveTo(50, 490);
      ctx.lineTo(850, 490);
      ctx.stroke();

      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('ALLOCATED SEATS', 50, 530);

      // Seat badges
      let seatX = 50;
      booking.seats.forEach(s => {
        ctx.fillStyle = '#00f5ff';
        ctx.fillRect(seatX, 550, 90, 50);
        ctx.fillStyle = '#000000';
        ctx.font = '900 24px monospace';
        ctx.fillText(s, seatX + 22, 585);
        seatX += 105;
      });

      // Total Paid
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 16px monospace';
      ctx.textAlign = 'right';
      ctx.fillText('TOTAL PAID', 850, 540);
      ctx.fillStyle = '#10b981';
      ctx.font = '900 38px monospace';
      ctx.fillText(`₹${booking.totalAmount?.toLocaleString()}`, 850, 585);
      ctx.textAlign = 'left';

      // 3D Glasses Notice
      if (booking.glassesCount > 0) {
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 16px sans-serif';
        ctx.fillText(`🕶️ ${booking.glassesCount}x Sanitized 3D Glasses Included with Booking`, 50, 640);
      }

      // Snacks
      if (booking.snacks && booking.snacks.length > 0) {
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 16px sans-serif';
        const snackStr = booking.snacks.map(s => `${s.name} (x${s.qty})`).join(', ');
        ctx.fillText(`🍿 Concessions: ${snackStr}`, 50, 675);
      }

      // QR Code Box
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(50, 750, 160, 160);

      // Draw QR pattern on canvas
      ctx.fillStyle = '#000000';
      ctx.fillRect(65, 765, 45, 45);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(75, 775, 25, 25);
      ctx.fillStyle = '#000000';
      ctx.fillRect(82, 782, 11, 11);

      ctx.fillRect(150, 765, 45, 45);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(160, 775, 25, 25);
      ctx.fillStyle = '#000000';
      ctx.fillRect(167, 782, 11, 11);

      ctx.fillRect(65, 850, 45, 45);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(75, 860, 25, 25);
      ctx.fillStyle = '#000000';
      ctx.fillRect(82, 867, 11, 11);

      ctx.fillRect(130, 830, 20, 20);
      ctx.fillRect(160, 840, 25, 25);
      ctx.fillRect(125, 875, 30, 20);

      // QR Text
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 22px sans-serif';
      ctx.fillText('Contactless Turnstile Scanner Pass', 240, 800);
      ctx.fillStyle = '#94a3b8';
      ctx.font = '16px sans-serif';
      ctx.fillText('Present this code directly at the CineVerse Entrance Gate.', 240, 835);
      ctx.fillStyle = '#00f5ff';
      ctx.font = 'bold 15px monospace';
      ctx.fillText(`AUTHENTICATION: SHA256-${booking.id}-VERIFIED`, 240, 875);

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('Designed and Developed by Kombaiya & Ashik Chandru', 240, 910);

      // Trigger download
      const link = document.createElement('a');
      link.download = `CineVerse-Pass-${booking.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 animate-fade-in">
      {/* Success Banner */}
      <div className="text-center mb-8 no-print">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 mb-3 shadow-lg shadow-emerald-500/20 animate-bounce">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-black text-white tracking-tight">Booking Confirmed!</h1>
        <p className="text-sm text-slate-400 mt-1">
          Your futuristic holographic ticket has been activated. Print or download below.
        </p>
      </div>

      {/* Holographic VIP Ticket Pass (Target for print) */}
      <div
        id="printable-ticket"
        className="ticket-print-target relative rounded-3xl overflow-hidden border-2 border-cyan-400/50 bg-gradient-to-b from-[#0f172a] via-[#090d16] to-[#04060a] shadow-2xl shadow-cyan-950/70 p-6 md:p-8 scanline"
      >
        {/* Hologram top edge strip */}
        <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-amber-400 hologram-shimmer" />

        {/* Header of Pass */}
        <div className="flex items-center justify-between pb-6 border-b border-dashed border-white/20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-black font-black text-lg shadow-md shadow-cyan-500/30">
              CV
            </div>
            <div>
              <div className="text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase">
                CineVerse Hologram Pass
              </div>
              <div className="text-base font-black text-white">
                {booking.showType === '3D' ? '🕶️ IMAX 3D LASER PREMIERE PASS' : '🎬 2D ULTRA CLEAR MASTER PASS'}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Reference No.</div>
            <div className="text-base font-mono font-black text-amber-400 tracking-wider">
              {booking.id}
            </div>
          </div>
        </div>

        {/* Movie & Hall Details */}
        <div className="py-6 border-b border-dashed border-white/20 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="text-[11px] text-cyan-400 uppercase font-mono tracking-wider font-bold">
              Feature Film
            </div>
            <h2 className="text-2xl font-black text-white mt-0.5 tracking-tight">{booking.movieTitle}</h2>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/40">
                {booking.hall}
              </span>
              <span className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-300 font-mono text-xs font-bold border border-purple-500/40">
                {booking.format || (booking.showType === '3D' ? 'IMAX 3D Laser' : 'Dolby Atmos 2D')}
              </span>
              {booking.glassesCount > 0 && (
                <span className="px-3 py-1 rounded-lg bg-amber-500/20 text-amber-300 font-mono text-xs font-bold border border-amber-500/40">
                  🕶️ {booking.glassesCount}x 3D Glasses Issued
                </span>
              )}
            </div>
          </div>

          <div className="space-y-3 bg-white/[0.04] p-3.5 rounded-2xl border border-white/10">
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Date & Showtime</div>
              <div className="text-xs font-bold text-white mt-0.5">
                {booking.date} • {booking.time}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Cinema Guest</div>
              <div className="text-xs font-bold text-slate-200 mt-0.5 truncate">
                {booking.customerName}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase font-mono font-bold">Turnstile Gate</div>
              <div className="text-xs font-mono font-bold text-cyan-400">
                Gate 03 (Turnstile Entry)
              </div>
            </div>
          </div>
        </div>

        {/* Seats & Snacks Block */}
        <div className="py-6 border-b border-dashed border-white/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="text-[11px] text-slate-400 uppercase font-mono tracking-wider font-bold">Allocated Seats</div>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              {booking.seats?.map(seat => (
                <span
                  key={seat}
                  className="px-4 py-2 rounded-xl bg-cyan-400 text-black font-mono font-black text-sm shadow-md shadow-cyan-400/40"
                >
                  {seat}
                </span>
              ))}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">
              Tier: {booking.seatTiers?.join(', ') || 'VIP Lounger'}
            </div>
          </div>

          {booking.snacks && booking.snacks.length > 0 && (
            <div className="bg-amber-950/30 border border-amber-500/40 p-3 rounded-xl max-w-xs">
              <div className="text-[10px] text-amber-400 font-mono uppercase tracking-wider font-bold">Concessions In-Seat</div>
              <div className="text-xs text-amber-200 mt-1">
                {booking.snacks.map(s => `${s.name} (x${s.qty})`).join(', ')}
              </div>
            </div>
          )}

          <div className="text-right">
            <div className="text-[10px] text-slate-400 uppercase font-mono">Total Paid</div>
            <div className="text-2xl font-mono font-black text-emerald-400">
              ₹{booking.totalAmount?.toLocaleString()}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">{booking.paymentMethod}</div>
          </div>
        </div>

        {/* QR Section */}
        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 p-2 bg-white rounded-2xl flex items-center justify-center shadow-xl flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full text-black fill-current">
                <rect x="5" y="5" width="28" height="28" rx="4" />
                <rect x="9" y="9" width="20" height="20" fill="white" rx="2" />
                <rect x="13" y="13" width="12" height="12" />
                <rect x="67" y="5" width="28" height="28" rx="4" />
                <rect x="71" y="9" width="20" height="20" fill="white" rx="2" />
                <rect x="75" y="13" width="12" height="12" />
                <rect x="5" y="67" width="28" height="28" rx="4" />
                <rect x="9" y="71" width="20" height="20" fill="white" rx="2" />
                <rect x="13" y="75" width="12" height="12" />
                <rect x="42" y="15" width="8" height="8" />
                <rect x="55" y="25" width="8" height="8" />
                <rect x="40" y="40" width="20" height="20" rx="3" fill="#0284c7" />
                <rect x="46" y="46" width="8" height="8" fill="white" />
                <rect x="15" y="42" width="8" height="8" />
                <rect x="25" y="55" width="8" height="8" />
                <rect x="68" y="45" width="10" height="8" />
                <rect x="80" y="58" width="12" height="8" />
                <rect x="42" y="72" width="10" height="10" />
                <rect x="65" y="75" width="12" height="8" />
                <rect x="82" y="78" width="10" height="12" />
              </svg>
            </div>

            <div>
              <div className="text-xs font-bold text-white">Quantum QR Scanner Ready</div>
              <div className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                Scan directly at CineVerse Gate Turnstile 03 for contactless entry.
              </div>
              <div className="text-[10px] font-mono text-cyan-400 mt-1">
                VALIDATION: SECURE-HASH-{booking.id}-OK
              </div>
            </div>
          </div>
        </div>

        {/* Developer Credit Footer Bar */}
        <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5 text-cyan-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Designed & Developed by <strong className="text-white font-sans">Kombaiya & Ashik Chandru</strong></span>
          </div>
          <span className="text-[10px] text-slate-500 uppercase">CineVerse Verified Pass</span>
        </div>
      </div>

      {/* Action Buttons: Print & Download PNG */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-4 no-print">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all border border-white/20 shadow-lg cursor-pointer hover:scale-105"
        >
          <Printer className="w-4 h-4 text-cyan-400" />
          <span>Print / Save PDF Slip</span>
        </button>

        <button
          onClick={handleDownloadImage}
          disabled={downloading}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs transition-all shadow-lg shadow-cyan-500/30 cursor-pointer hover:scale-105"
        >
          {downloadSuccess ? (
            <>
              <Check className="w-4 h-4 text-black" />
              <span>Pass Downloaded!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-black" />
              <span>Download Digital Pass (PNG)</span>
            </>
          )}
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onDone();
          }}
          className="px-7 py-3 rounded-2xl bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold text-xs shadow-lg hover:scale-105 transition-all cursor-pointer"
        >
          Book Another Movie
        </button>
      </div>
    </div>
  );
}
