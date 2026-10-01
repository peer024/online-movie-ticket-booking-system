import React, { useState } from 'react';
import { sound } from '../../services/soundEngine';
import { Download, Printer, CheckCircle2, Ticket, Film, Calendar, Clock, MapPin, Check } from 'lucide-react';

export default function DigitalTicket({
  booking: inputBooking,
  onDone
}) {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Guarantee booking is never null/undefined and all properties exist
  const b = inputBooking?.booking || inputBooking || {};
  const booking = {
    id: b.id || `CP-${Math.floor(10000 + Math.random() * 90000)}`,
    movieId: b.movieId || 'mov-goat',
    movieTitle: b.movieTitle || 'The Greatest of All Time (GOAT)',
    showType: b.showType || '2D',
    format: b.format || (b.showType === '3D' ? '3D Laser' : '2D Dolby Atmos'),
    date: b.date || 'Today',
    time: b.time || '07:00 PM',
    hall: b.hall || 'Screen 1',
    seats: Array.isArray(b.seats) && b.seats.length > 0 ? b.seats : ['A3', 'A4'],
    seatTiers: Array.isArray(b.seatTiers) && b.seatTiers.length > 0 ? b.seatTiers : ['VIP Recliner'],
    ticketAmount: Number(b.ticketAmount) || 700,
    glassesCount: Number(b.glassesCount) || 0,
    glassesAmount: Number(b.glassesAmount) || 0,
    snacks: Array.isArray(b.snacks) ? b.snacks : [],
    snacksAmount: Number(b.snacksAmount) || 0,
    discount: Number(b.discount) || 0,
    totalAmount: Number(b.totalAmount) || 700,
    paymentMethod: b.paymentMethod || 'UPI (Google Pay / PhonePe)',
    customerName: b.customerName || 'Cinema Guest',
    customerEmail: b.customerEmail || 'guest@example.com',
    customerPhone: b.customerPhone || '+91 98765 43210',
    createdAt: b.createdAt || new Date().toISOString(),
    status: b.status || 'Confirmed'
  };

  // Clean Print Handler for PDF / Printing
  const handlePrint = () => {
    sound.playClick();
    const printWindow = window.open('', '_blank', 'width=800,height=900');
    if (!printWindow) {
      window.print();
      return;
    }

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Movie E-Ticket - ${booking.id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap');
            * { box-sizing: border-box; margin: 0; padding: 0; }
            body {
              font-family: 'Inter', sans-serif;
              background-color: #f8fafc;
              color: #0f172a;
              padding: 40px 20px;
              display: flex;
              justify-content: center;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .ticket-card {
              width: 100%;
              max-width: 600px;
              background: #ffffff;
              border: 2px solid #e2e8f0;
              border-radius: 20px;
              overflow: hidden;
              box-shadow: 0 10px 25px rgba(0,0,0,0.08);
            }
            .ticket-header {
              background: #0f172a;
              color: #ffffff;
              padding: 24px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .brand {
              font-size: 20px;
              font-weight: 800;
              letter-spacing: -0.5px;
            }
            .brand span { color: #f43f5e; }
            .booking-id {
              font-family: 'JetBrains Mono', monospace;
              font-size: 13px;
              color: #94a3b8;
            }
            .ticket-body {
              padding: 28px;
            }
            .movie-title {
              font-size: 24px;
              font-weight: 800;
              color: #0f172a;
              margin-bottom: 6px;
            }
            .badge {
              display: inline-block;
              background: #f1f5f9;
              padding: 4px 10px;
              border-radius: 6px;
              font-size: 12px;
              font-weight: 600;
              color: #475569;
              margin-right: 8px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 16px;
              margin: 24px 0;
              padding: 16px 0;
              border-top: 1px dashed #cbd5e1;
              border-bottom: 1px dashed #cbd5e1;
            }
            .info-item label {
              font-size: 11px;
              text-transform: uppercase;
              color: #64748b;
              font-weight: 600;
              display: block;
              margin-bottom: 2px;
            }
            .info-item span {
              font-size: 14px;
              font-weight: 700;
              color: #1e293b;
            }
            .seats-row {
              margin-bottom: 20px;
            }
            .seat-pill {
              display: inline-block;
              background: #0f172a;
              color: #ffffff;
              font-family: 'JetBrains Mono', monospace;
              font-size: 13px;
              font-weight: 700;
              padding: 6px 12px;
              border-radius: 8px;
              margin-right: 6px;
              margin-top: 6px;
            }
            .qr-section {
              background: #f8fafc;
              border-radius: 12px;
              padding: 16px;
              display: flex;
              align-items: center;
              gap: 16px;
              margin-top: 20px;
            }
            .qr-box {
              width: 80px;
              height: 80px;
              background: #ffffff;
              border: 1px solid #cbd5e1;
              border-radius: 8px;
              padding: 6px;
            }
            .total-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: 20px;
              padding-top: 16px;
              border-top: 2px solid #0f172a;
            }
            .total-amount {
              font-size: 22px;
              font-weight: 800;
              color: #0f172a;
            }
            .footer-credit {
              text-align: center;
              font-size: 11px;
              color: #64748b;
              margin-top: 24px;
              padding-top: 12px;
              border-top: 1px solid #e2e8f0;
            }
          </style>
        </head>
        <body>
          <div class="ticket-card">
            <div class="ticket-header">
              <div>
                <div class="brand">Cine<span>Pass</span> Cinemas</div>
                <div style="font-size: 11px; color: #94a3b8;">Official Movie Ticket</div>
              </div>
              <div class="booking-id">ID: ${booking.id}</div>
            </div>

            <div class="ticket-body">
              <div class="movie-title">${booking.movieTitle}</div>
              <div>
                <span class="badge">${booking.format}</span>
                <span class="badge">${booking.hall}</span>
              </div>

              <div class="info-grid">
                <div class="info-item">
                  <label>Date & Time</label>
                  <span>${booking.date} at ${booking.time}</span>
                </div>
                <div class="info-item">
                  <label>Customer Name</label>
                  <span>${booking.customerName}</span>
                </div>
                <div class="info-item">
                  <label>Cinema Hall</label>
                  <span>${booking.hall}</span>
                </div>
                <div class="info-item">
                  <label>Payment Mode</label>
                  <span>${booking.paymentMethod}</span>
                </div>
              </div>

              <div class="seats-row">
                <div style="font-size: 11px; text-transform: uppercase; color: #64748b; font-weight: 600; margin-bottom: 4px;">Allocated Seats (${booking.seats.length})</div>
                ${booking.seats.map(s => `<span class="seat-pill">${s}</span>`).join('')}
                <div style="font-size: 12px; color: #64748b; margin-top: 6px;">Category: ${booking.seatTiers?.join(', ')}</div>
              </div>

              <div class="qr-section">
                <div class="qr-box">
                  <svg viewBox="0 0 100 100" width="100%" height="100%">
                    <rect x="5" y="5" width="28" height="28" rx="3" />
                    <rect x="9" y="9" width="20" height="20" fill="white" />
                    <rect x="13" y="13" width="12" height="12" />
                    <rect x="67" y="5" width="28" height="28" rx="3" />
                    <rect x="71" y="9" width="20" height="20" fill="white" />
                    <rect x="75" y="13" width="12" height="12" />
                    <rect x="5" y="67" width="28" height="28" rx="3" />
                    <rect x="9" y="71" width="20" height="20" fill="white" />
                    <rect x="13" y="75" width="12" height="12" />
                    <rect x="42" y="20" width="8" height="8" />
                    <rect x="55" y="30" width="8" height="8" />
                    <rect x="40" y="50" width="16" height="16" fill="#f43f5e" />
                    <rect x="68" y="55" width="10" height="8" />
                  </svg>
                </div>
                <div>
                  <div style="font-size: 13px; font-weight: 700;">Contactless Entry QR Code</div>
                  <div style="font-size: 11px; color: #64748b; margin-top: 2px;">
                    Scan this digital ticket directly at the cinema turnstile scanner.
                  </div>
                </div>
              </div>

              <div class="total-row">
                <span style="font-weight: 700; color: #475569;">Total Paid Amount</span>
                <span class="total-amount">₹${booking.totalAmount.toLocaleString()}</span>
              </div>

              <div class="footer-credit">
                Project Designed & Developed by <strong>Kombaiya & Ashik Chandru</strong>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(printContent);
    printWindow.document.close();
  };

  // Download Ticket as Clean Image (Canvas PNG)
  const handleDownloadImage = () => {
    sound.playClick();
    setDownloading(true);

    try {
      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 950;
      const ctx = canvas.getContext('2d');

      // Background
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, 800, 950);

      // Header Banner
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 800, 130);

      // Brand
      ctx.fillStyle = '#ffffff';
      ctx.font = '800 28px sans-serif';
      ctx.fillText('CinePass Cinemas', 50, 65);

      ctx.fillStyle = '#f43f5e';
      ctx.font = 'bold 14px sans-serif';
      ctx.fillText('OFFICIAL MOVIE E-TICKET', 50, 95);

      // Booking ID
      ctx.fillStyle = '#94a3b8';
      ctx.font = 'bold 15px monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`ID: ${booking.id}`, 750, 75);
      ctx.textAlign = 'left';

      // Movie Title
      ctx.fillStyle = '#0f172a';
      ctx.font = '800 32px sans-serif';
      ctx.fillText(booking.movieTitle, 50, 200);

      ctx.fillStyle = '#475569';
      ctx.font = '600 16px sans-serif';
      ctx.fillText(`${booking.format} • ${booking.hall}`, 50, 235);

      // Divider
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(50, 270);
      ctx.lineTo(750, 270);
      ctx.stroke();

      // Info Fields
      ctx.font = '600 13px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText('DATE & TIME:', 50, 315);
      ctx.fillText('GUEST NAME:', 50, 360);
      ctx.fillText('PAYMENT METHOD:', 450, 315);
      ctx.fillText('HALL / SCREEN:', 450, 360);

      ctx.font = 'bold 16px sans-serif';
      ctx.fillStyle = '#0f172a';
      ctx.fillText(`${booking.date} at ${booking.time}`, 180, 315);
      ctx.fillText(booking.customerName, 180, 360);
      ctx.fillText(booking.paymentMethod, 600, 315);
      ctx.fillText(booking.hall, 600, 360);

      // Divider
      ctx.beginPath();
      ctx.moveTo(50, 410);
      ctx.lineTo(750, 410);
      ctx.stroke();

      // Seats
      ctx.font = 'bold 14px sans-serif';
      ctx.fillStyle = '#64748b';
      ctx.fillText(`CONFIRMED SEATS (${booking.seats.length}):`, 50, 455);

      booking.seats.forEach((seat, idx) => {
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(50 + idx * 70, 480, 60, 40);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px monospace';
        ctx.fillText(seat, 65 + idx * 70, 505);
      });

      // Total Box
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(50, 570, 700, 90);
      ctx.fillStyle = '#475569';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('TOTAL AMOUNT PAID', 80, 622);
      ctx.fillStyle = '#0f172a';
      ctx.font = '800 28px sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(`₹${booking.totalAmount.toLocaleString()}`, 720, 625);
      ctx.textAlign = 'left';

      // QR Code Box
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(50, 690, 110, 110);
      ctx.strokeStyle = '#cbd5e1';
      ctx.strokeRect(50, 690, 110, 110);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(65, 705, 30, 30);
      ctx.fillRect(115, 705, 30, 30);
      ctx.fillRect(65, 755, 30, 30);
      ctx.fillRect(105, 745, 20, 20);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 18px sans-serif';
      ctx.fillText('Turnstile Entry QR Code', 185, 735);
      ctx.fillStyle = '#64748b';
      ctx.font = '14px sans-serif';
      ctx.fillText('Show this QR ticket at the cinema entry gate.', 185, 765);

      // Footer Credit
      ctx.fillStyle = '#64748b';
      ctx.font = 'bold 13px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Project Designed & Developed by Kombaiya & Ashik Chandru', 400, 900);

      // Trigger Download
      const link = document.createElement('a');
      link.download = `CinePass-Ticket-${booking.id}.png`;
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
    <div className="max-w-xl mx-auto px-4 py-8 text-gray-900">
      {/* Confirmation Success Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 mb-3 shadow-xs">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Booking Confirmed!</h1>
        <p className="text-xs text-gray-500 mt-1">
          Your movie tickets have been reserved successfully.
        </p>
      </div>

      {/* Realistic Movie Ticket Card */}
      <div className="rounded-2xl overflow-hidden border border-slate-700 bg-white text-slate-900 shadow-2xl">
        {/* Ticket Top Dark Bar */}
        <div className="bg-[#0f172a] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500 flex items-center justify-center text-white font-black text-sm">
              CP
            </div>
            <div>
              <div className="text-base font-bold tracking-tight">Cine<span className="text-rose-400">Pass</span> Cinemas</div>
              <div className="text-[10px] text-slate-400">Official E-Ticket</div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-slate-400 font-mono">BOOKING ID</div>
            <div className="text-xs font-mono font-bold text-rose-400">{booking.id}</div>
          </div>
        </div>

        {/* Ticket Content */}
        <div className="p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">{booking.movieTitle}</h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-semibold">
              {booking.format}
            </span>
            <span className="px-2.5 py-0.5 rounded bg-slate-100 text-slate-700 text-xs font-semibold">
              {booking.hall}
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 my-5 py-4 border-y border-dashed border-slate-200 text-xs">
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Show Date & Time</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block">{booking.date} • {booking.time}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Cinema Guest</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block truncate">{booking.customerName}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Screen / Audi</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block">{booking.hall}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase text-slate-400 font-bold block">Payment Mode</span>
              <span className="font-bold text-slate-800 text-sm mt-0.5 block">{booking.paymentMethod}</span>
            </div>
          </div>

          {/* Seats Allocation */}
          <div className="mb-5">
            <span className="text-[10px] uppercase text-slate-400 font-bold block mb-1.5">Confirmed Seats</span>
            <div className="flex flex-wrap items-center gap-2">
              {booking.seats.map(seat => (
                <span
                  key={seat}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 text-white font-mono font-bold text-xs shadow-sm"
                >
                  {seat}
                </span>
              ))}
            </div>
            <span className="text-[11px] text-slate-500 mt-1 block">
              Tier: {booking.seatTiers?.join(', ')}
            </span>
          </div>

          {/* Snacks (if added) */}
          {booking.snacks && booking.snacks.length > 0 && (
            <div className="mb-5 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs">
              <span className="font-bold text-amber-800 block mb-0.5">Food & Concessions:</span>
              <span className="text-amber-700">
                {booking.snacks.map(s => `${s.name} (x${s.qty})`).join(', ')}
              </span>
            </div>
          )}

          {/* Turnstile QR Code */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-4">
            <div className="w-16 h-16 bg-white p-1.5 rounded-lg border border-slate-300 flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
                <rect x="5" y="5" width="28" height="28" rx="3" />
                <rect x="9" y="9" width="20" height="20" fill="white" />
                <rect x="13" y="13" width="12" height="12" />
                <rect x="67" y="5" width="28" height="28" rx="3" />
                <rect x="71" y="9" width="20" height="20" fill="white" />
                <rect x="75" y="13" width="12" height="12" />
                <rect x="5" y="67" width="28" height="28" rx="3" />
                <rect x="9" y="71" width="20" height="20" fill="white" />
                <rect x="13" y="75" width="12" height="12" />
                <rect x="42" y="20" width="8" height="8" />
                <rect x="55" y="30" width="8" height="8" />
                <rect x="40" y="50" width="16" height="16" fill="#f43f5e" />
                <rect x="68" y="55" width="10" height="8" />
              </svg>
            </div>
            <div>
              <div className="text-xs font-bold text-slate-800">Cinema Turnstile QR Pass</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                Scan this code directly at the theatre turnstile gate.
              </div>
            </div>
          </div>

          {/* Total Amount */}
          <div className="flex items-center justify-between pt-4 mt-5 border-t border-slate-200">
            <span className="text-xs font-bold text-slate-600">Total Amount Paid</span>
            <span className="text-xl font-bold text-slate-900">₹{booking.totalAmount.toLocaleString()}</span>
          </div>

          {/* Developer Credit Footer */}
          <div className="mt-5 pt-3 border-t border-slate-100 text-center text-[11px] text-slate-400">
            Project Developed by <strong>Kombaiya & Ashik Chandru</strong>
          </div>
        </div>
      </div>

      {/* Action Buttons: Print PDF & Download PNG */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white font-semibold text-xs transition-all cursor-pointer shadow-xs"
        >
          <Printer className="w-4 h-4 text-rose-400" />
          <span>Print E-Ticket (PDF)</span>
        </button>

        <button
          onClick={handleDownloadImage}
          disabled={downloading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-all shadow-xs cursor-pointer"
        >
          {downloadSuccess ? (
            <>
              <Check className="w-4 h-4 text-white" />
              <span>Downloaded!</span>
            </>
          ) : (
            <>
              <Download className="w-4 h-4 text-white" />
              <span>Download Image (PNG)</span>
            </>
          )}
        </button>

        <button
          onClick={onDone}
          className="px-5 py-2.5 rounded-xl bg-white hover:bg-gray-50 text-gray-700 font-semibold text-xs transition-all border border-gray-300 cursor-pointer shadow-xs"
        >
          Book Another Movie
        </button>
      </div>
    </div>
  );
}
