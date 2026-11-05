import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const file = resolve(root, 'site/_data/shops.json');
const data = JSON.parse(readFileSync(file, 'utf8'));

data.shops.push(
  {
    slug: 'computer-parts',
    name: 'Tek Desk',
    audience: 'desk jockeys with three devices, no free ports, and a laptop cooking their thighs',
    kicker: 'Gear for the desk you stare at',
    headline: 'A 7-port hub that reaches everywhere — and a stand that stops the laptop soup',
    lede: 'Aluminium hub with 4K HDMI, 3× USB 3.0, SD/microSD and USB-C PD passthrough; one plug powers the whole desk. Paired with a height-adjustable stand that lifts the laptop to eye level and lets it breathe.',
    accent: '#3D6B8E',
    note: 'Hub chips run cool under load and the stand ships flat. Both are pure commodity — the filter is the single-cable workflow and no fan noise.',
    ship: '3–6 days, DHL tracked from DE warehouse',
    priceFloor: 21.9,
    products: [
      { id: 'cp-usbhub', name: '7-in-1 USB-C hub', price: 29.9, kind: 'usb-c hub', blurb: 'HDMI 4K, 3× USB 3.0, SD/microSD, PD 100W. One cable for desk, screen and charging.', art: ['rect x=20 y=34 w=64 h=32 rx=6', 'circle cx=30 cy=50 r=4', 'circle cx=40 cy=50 r=4', 'circle cx=50 cy=50 r=4', 'path d=M66 50h8'] },
      { id: 'cp-laptopstand', name: 'Aluminium laptop stand', price: 34.9, kind: 'laptop stand', blurb: 'Folds flat, 6-level tilt, raises to eye height and vents the hot underside. 1.4 kg.', art: ['path d=M20 66l10-36h44l10 36', 'path d=M28 46h48', 'path d=M20 66h64'] },
      { id: 'cp-cable', name: 'Right-angle USB-C cable 2m', price: 12.9, kind: 'usb-c cable', blurb: '100W PD, 90° plug that never shears against the desk edge. Braided, L-socket.', art: ['path d=M24 30h30l14 24', 'rect x=14 y=26 w=10 h=8 rx=3', 'rect x=62 y=52 w=10 h=8 rx=3'] },
      { id: 'cp-mousepad', name: 'XL desk mat', price: 24.9, kind: 'desk mat', blurb: '90×40 cm stitched-edge fabric, natural rubber base. Quiets keyboards and steadies mice.', art: ['rect x=12 y=26 w=80 h=48 rx=6', 'path d=M20 34h64', 'path d=M20 66h64'] }
    ],
    angles: ['desk with hub + monitor 4K', 'phone + headset, fold flat', 'cable 90° bend close-up', 'laptop on stand, eye level']
  },
  {
    slug: 'microphone',
    name: 'Pod Shed',
    audience: 'podcast and YouTube hobbyists recording in rented flats with thin walls',
    kicker: 'Quiet on the track, done cheap',
    headline: 'A boom arm that gets the mic off the desk — and a foam hood that kills the boom',
    lede: 'Gas-spring boom arm holds a condenser steady without drift; a foam shock-mount and pop hood sit between you and the neighbours. For clean takes in a small room, not a studio.',
    accent: '#B07A2E',
    note: 'No drivers, no software. The win is mechanical isolation — the boom clamps, the hood damps, the desk stops drumming through the track.',
    ship: '3–6 days, DHL tracked from DE warehouse',
    priceFloor: 17.9,
    products: [
      { id: 'mic-arm', name: 'Gas-spring boom arm', price: 24.9, kind: 'boom arm', blurb: 'C-clamp 5 cm desks, 360° swivel, 1.2 kg counterweight. Holds position at any angle.', art: ['path d=M16 66h40a8 8 0 0 0 0-16l-16-16', 'circle cx=16 cy=66 r=8', 'path d=M40 34l10-10'] },
      { id: 'mic-mount', name: 'Foam shock mount set', price: 19.9, kind: 'shock mount', blurb: 'Foam dories cut desk drumming; the clamp ring fits 3/8" and 5/8" threads.', art: ['circle cx=48 cy=44 r=20', 'path d=M28 44h40', 'circle cx=48 cy=44 r=8'] },
      { id: 'mic-hood', name: 'Pop hood + foam cap', price: 9.9, kind: 'pop filter', blurb: 'Dual-layer mesh hood plus foam cap push the plosives off the capsule.', art: ['circle cx=48 cy=40 r=18', 'path d=M38 28c-4 8-4 16 0 24', 'path d=M58 28c4 8 4 16 0 24'] },
      { id: 'mic-condenser', name: 'USB condenser mic', price: 79.9, kind: 'condenser mic', blurb: 'Cardioid capsule, zero-latency monitor jack, 24-bit. No driver, works as plug-and-play.', art: ['rect x=34 y=30 w=6 h=34 rx=3', 'circle cx=49 cy=35 r=16', 'path d=M49 51v13'] }
    ],
    angles: ['mic on boom, empty desk', 'clamp + mount close-up', 'hood over capsule', 'USB plug + phone stand']
  }
);

writeFileSync(file, JSON.stringify(data, null, 1));
console.log('shops now:', data.shops.map(s => s.slug).join(','));
