import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { sound } from '../../services/soundEngine';
import { Eye, RotateCw, Maximize2, ShieldCheck, Sparkles, Compass, Glasses, Sliders } from 'lucide-react';

export default function CinemaHall3D({
  seatsData = [],
  selectedSeats = [],
  onToggleSeat,
  movieTitle = 'Feature Film',
  showType = '3D',
  experience = 'IMAX 3D Laser'
}) {
  const mountRef = useRef(null);
  const [hoveredSeat, setHoveredSeat] = useState(null);
  const [cameraMode, setCameraMode] = useState('hall'); // 'hall' | 'screen' | 'pov'
  const [activePovSeat, setActivePovSeat] = useState(null);
  const [glassesMode, setGlassesMode] = useState(showType === '3D');

  // References for Three.js
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const seatMeshesRef = useRef(new Map());
  const targetCamPosRef = useRef(new THREE.Vector3(0, 18, 25));
  const targetCamLookRef = useRef(new THREE.Vector3(0, 3, -2));
  const currentCamLookRef = useRef(new THREE.Vector3(0, 3, -2));
  const isDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });

  // Camera Target interpolation
  useEffect(() => {
    if (cameraMode === 'hall') {
      targetCamPosRef.current.set(0, 18, 25);
      targetCamLookRef.current.set(0, 2, -2);
    } else if (cameraMode === 'screen') {
      targetCamPosRef.current.set(0, 7.5, 20);
      targetCamLookRef.current.set(0, 6.5, -16);
    } else if (cameraMode === 'pov') {
      const targetSeatId = activePovSeat || selectedSeats[0] || 'C5';
      const mesh = seatMeshesRef.current.get(targetSeatId);
      if (mesh) {
        targetCamPosRef.current.set(mesh.position.x, mesh.position.y + 1.25, mesh.position.z + 0.15);
        targetCamLookRef.current.set(0, 6.8, -16);
      } else {
        targetCamPosRef.current.set(0, 3.5, 2);
        targetCamLookRef.current.set(0, 6.8, -16);
      }
    }
  }, [cameraMode, activePovSeat, selectedSeats]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth;
    const height = mount.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x05070c);
    scene.fog = new THREE.FogExp2(0x05070c, 0.018);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 120);
    camera.position.copy(targetCamPosRef.current);
    cameraRef.current = camera;

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mount.innerHTML = '';
    mount.appendChild(renderer.domElement);

    // ================== CINEMA LIGHTING ==================
    const ambientLight = new THREE.AmbientLight(0x131a2b, 0.85);
    scene.add(ambientLight);

    // Screen Projection Light
    const screenLight = new THREE.SpotLight(0x38bdf8, 5.5, 50, Math.PI / 2.8, 0.65, 1.1);
    screenLight.position.set(0, 7.5, -15);
    screenLight.target.position.set(0, 1, 5);
    scene.add(screenLight);
    scene.add(screenLight.target);

    // Overhead ambient fill
    const overheadFill = new THREE.PointLight(0x8b5cf6, 1.4, 38);
    overheadFill.position.set(0, 15, 4);
    scene.add(overheadFill);

    // ================== CURVED IMAX SILVER SCREEN ==================
    const screenCurveRadius = 26;
    const screenArcAngle = Math.PI / 3.4;
    const screenHeight = 11.5;
    const screenGeo = new THREE.CylinderGeometry(
      screenCurveRadius,
      screenCurveRadius,
      screenHeight,
      48,
      1,
      true,
      -screenArcAngle / 2 - Math.PI / 2,
      screenArcAngle
    );

    // Dynamic screen canvas
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const drawScreenContent = (frame = 0) => {
      // Dynamic gradient
      const grad = ctx.createLinearGradient(0, 0, 1024, 512);
      const hueShift = Math.sin(frame * 0.02) * 20;
      grad.addColorStop(0, `hsl(${195 + hueShift}, 90%, 35%)`);
      grad.addColorStop(0.5, `hsl(${220 + hueShift}, 85%, 45%)`);
      grad.addColorStop(1, `hsl(${280 + hueShift}, 80%, 40%)`);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1024, 512);

      // Dark cinematic vignette
      const radGrad = ctx.createRadialGradient(512, 256, 100, 512, 256, 520);
      radGrad.addColorStop(0, 'rgba(0,0,0,0.1)');
      radGrad.addColorStop(1, 'rgba(0,0,0,0.7)');
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, 1024, 512);

      // Holographic scanlines on screen
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      for (let y = 0; y < 512; y += 4) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(1024, y);
        ctx.stroke();
      }

      // Title & Branding
      ctx.fillStyle = '#ffffff';
      ctx.font = '900 42px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(movieTitle.toUpperCase(), 512, 220);

      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 22px monospace';
      ctx.fillText(`★ ${experience.toUpperCase()} ★`, 512, 270);

      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 20px sans-serif';
      ctx.fillText(showType === '3D' ? '👓 3D STEREOSCOPIC LASER' : '🎬 2D ULTRA CLEAR MASTER', 512, 320);
    };

    drawScreenContent(0);

    const screenTexture = new THREE.CanvasTexture(canvas);
    const screenMat = new THREE.MeshStandardMaterial({
      map: screenTexture,
      emissive: 0x38bdf8,
      emissiveMap: screenTexture,
      emissiveIntensity: 0.85,
      side: THREE.BackSide,
      roughness: 0.3,
      metalness: 0.2
    });

    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 6.8, 10.5);
    scene.add(screenMesh);

    // Screen bezel frame
    const frameGeo = new THREE.CylinderGeometry(
      screenCurveRadius + 0.1,
      screenCurveRadius + 0.1,
      screenHeight + 0.6,
      48,
      1,
      true,
      -screenArcAngle / 2 - Math.PI / 2,
      screenArcAngle
    );
    const frameMat = new THREE.MeshBasicMaterial({ color: 0x020408, side: THREE.BackSide });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    frameMesh.position.copy(screenMesh.position);
    scene.add(frameMesh);

    // ================== VOLUMETRIC PROJECTOR BEAM ==================
    // Projector cone from booth (z = 24, y = 14) to screen (z = -15, y = 7)
    const beamLength = 40;
    const beamRadiusTop = 0.4;
    const beamRadiusBottom = 13;
    const beamGeo = new THREE.CylinderGeometry(beamRadiusBottom, beamRadiusTop, beamLength, 32, 1, true);

    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.09,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const beamMesh = new THREE.Mesh(beamGeo, beamMat);
    // Align beam along the direction from booth to screen
    beamMesh.position.set(0, 10.5, 4.5);
    beamMesh.rotation.x = Math.PI / 2 + 0.18;
    scene.add(beamMesh);

    // ================== DUST MOTE PARTICLE SYSTEM ==================
    // 600 particles dancing in the theater light beam
    const particleCount = 600;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = [];

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 20;
      particlePositions[i * 3 + 1] = 1 + Math.random() * 14;
      particlePositions[i * 3 + 2] = -12 + Math.random() * 32;

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.005,
        y: (Math.random() - 0.5) * 0.004,
        z: (Math.random() - 0.5) * 0.005
      });
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x67e8f9,
      size: 0.09,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending
    });
    const dustParticles = new THREE.Points(particleGeo, particleMat);
    scene.add(dustParticles);

    // ================== ACOUSTIC SIDE WALLS WITH LED BAFFLES ==================
    [-18, 18].forEach(wallX => {
      const wallGeo = new THREE.PlaneGeometry(45, 18);
      const wallMat = new THREE.MeshStandardMaterial({
        color: 0x070b14,
        roughness: 0.9,
        metalness: 0.1
      });
      const wall = new THREE.Mesh(wallGeo, wallMat);
      wall.position.set(wallX, 8, 4);
      wall.rotation.y = wallX > 0 ? -Math.PI / 2 : Math.PI / 2;
      scene.add(wall);

      // Acoustic LED rib vertical fins
      for (let zFin = -10; zFin <= 20; zFin += 5) {
        const finGeo = new THREE.BoxGeometry(0.2, 10, 0.4);
        const finMat = new THREE.MeshBasicMaterial({ color: 0x00f5ff });
        const fin = new THREE.Mesh(finGeo, finMat);
        fin.position.set(wallX > 0 ? wallX - 0.2 : wallX + 0.2, 6, zFin);
        scene.add(fin);
      }
    });

    // Floor
    const floorGeo = new THREE.PlaneGeometry(36, 44);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x080c16,
      roughness: 0.8,
      metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -0.1, 4);
    floor.receiveShadow = true;
    scene.add(floor);

    // Side Aisle LED lights
    [-11.5, 11.5].forEach(xPos => {
      const aisleGeo = new THREE.BoxGeometry(0.3, 0.08, 32);
      const aisleMat = new THREE.MeshBasicMaterial({ color: 0x00f5ff });
      const aisle = new THREE.Mesh(aisleGeo, aisleMat);
      aisle.position.set(xPos, 0.05, 4);
      scene.add(aisle);
    });

    // ================== 3D SEAT MATRIX BUILDER ==================
    const cushionGeo = new THREE.BoxGeometry(0.85, 0.35, 0.85);
    const backrestGeo = new THREE.BoxGeometry(0.85, 0.95, 0.22);
    const armrestGeo = new THREE.BoxGeometry(0.14, 0.45, 0.82);
    const headrestGeo = new THREE.BoxGeometry(0.75, 0.3, 0.25);
    const cupGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.12, 12);

    seatMeshesRef.current.clear();

    seatsData.forEach(seat => {
      const { id, tier, isBooked, rowIndex, colIndex } = seat;
      const isSelected = selectedSeats.includes(id);

      const zPos = -5 + rowIndex * 2.5;
      const yPos = 0.2 + rowIndex * 0.65;
      const totalColsInRow = 10;
      const xSpacing = 1.6;
      const xPos = (colIndex - totalColsInRow / 2 + 0.5) * xSpacing;

      const chairGroup = new THREE.Group();
      chairGroup.position.set(xPos, yPos, zPos);
      chairGroup.userData = { seatId: id, tier, isBooked, rowIndex, colIndex, yElevation: yPos };

      let cushionColor = 0x1e293b;
      let emissiveColor = 0x000000;
      let emissiveIntensity = 0;

      if (isBooked) {
        cushionColor = 0x111622;
      } else if (isSelected) {
        cushionColor = 0x00f5ff;
        emissiveColor = 0x00f5ff;
        emissiveIntensity = 0.75;
      } else {
        if (tier === 'VIP') {
          cushionColor = 0xb45309;
          emissiveColor = 0x78350f;
          emissiveIntensity = 0.25;
        } else if (tier === 'Executive') {
          cushionColor = 0x0284c7;
          emissiveColor = 0x0369a1;
          emissiveIntensity = 0.2;
        } else {
          cushionColor = 0x475569;
        }
      }

      const seatMat = new THREE.MeshStandardMaterial({
        color: cushionColor,
        emissive: emissiveColor,
        emissiveIntensity: emissiveIntensity,
        roughness: 0.4,
        metalness: 0.2
      });

      const frameMat = new THREE.MeshStandardMaterial({
        color: 0x080d18,
        roughness: 0.9,
        metalness: 0.6
      });

      // Cushion
      const cushionMesh = new THREE.Mesh(cushionGeo, seatMat);
      cushionMesh.position.set(0, 0.4, 0);
      cushionMesh.castShadow = true;
      chairGroup.add(cushionMesh);

      // Backrest - slightly reclined if selected!
      const backrestMesh = new THREE.Mesh(backrestGeo, seatMat);
      backrestMesh.position.set(0, 0.95, 0.35);
      backrestMesh.rotation.x = isSelected ? -0.25 : -0.12;
      backrestMesh.castShadow = true;
      chairGroup.add(backrestMesh);

      // VIP Headrest
      if (tier === 'VIP') {
        const headrestMesh = new THREE.Mesh(headrestGeo, seatMat);
        headrestMesh.position.set(0, 1.5, 0.42);
        chairGroup.add(headrestMesh);
      }

      // Armrests + Cupholders
      [-0.48, 0.48].forEach(armX => {
        const armMesh = new THREE.Mesh(armrestGeo, frameMat);
        armMesh.position.set(armX, 0.55, 0.05);
        chairGroup.add(armMesh);

        // Cup holder
        const cup = new THREE.Mesh(cupGeo, new THREE.MeshBasicMaterial({ color: 0x1e293b }));
        cup.position.set(armX, 0.8, -0.2);
        chairGroup.add(cup);
      });

      // Pedestal
      const standGeo = new THREE.CylinderGeometry(0.12, 0.16, yPos + 0.3, 8);
      const standMesh = new THREE.Mesh(standGeo, frameMat);
      standMesh.position.set(0, -yPos / 2 + 0.15, 0);
      chairGroup.add(standMesh);

      scene.add(chairGroup);
      seatMeshesRef.current.set(id, chairGroup);
    });

    // ================== RAYCASTING ==================
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const getIntersectedSeat = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const allMeshes = [];
      seatMeshesRef.current.forEach(group => {
        group.traverse(child => {
          if (child.isMesh) allMeshes.push(child);
        });
      });

      const intersects = raycaster.intersectObjects(allMeshes);
      if (intersects.length > 0) {
        let parent = intersects[0].object.parent;
        while (parent && !parent.userData?.seatId) {
          parent = parent.parent;
        }
        return parent?.userData || null;
      }
      return null;
    };

    const handlePointerMove = (event) => {
      if (isDraggingRef.current) return;
      const seatInfo = getIntersectedSeat(event);
      if (seatInfo) {
        const targetSeat = seatsData.find(s => s.id === seatInfo.seatId);
        if (targetSeat) {
          setHoveredSeat(targetSeat);
          sound.playHover();
        }
      } else {
        setHoveredSeat(null);
      }
    };

    const handlePointerDown = (event) => {
      if (event.button === 0) {
        isDraggingRef.current = true;
        previousMousePositionRef.current = { x: event.clientX, y: event.clientY };
      }
    };

    const handlePointerUp = (event) => {
      const movedX = Math.abs(event.clientX - previousMousePositionRef.current.x);
      const movedY = Math.abs(event.clientY - previousMousePositionRef.current.y);
      isDraggingRef.current = false;

      if (movedX < 5 && movedY < 5) {
        const seatInfo = getIntersectedSeat(event);
        if (seatInfo && !seatInfo.isBooked) {
          onToggleSeat(seatInfo.seatId);
          setActivePovSeat(seatInfo.seatId);
          if (selectedSeats.includes(seatInfo.seatId)) {
            sound.playSeatDeselect();
          } else {
            sound.playSeatSelect(seatInfo.tier);
          }
        }
      }
    };

    const handleDragMove = (event) => {
      if (!isDraggingRef.current || cameraMode === 'pov') return;
      const deltaX = event.clientX - previousMousePositionRef.current.x;
      const deltaY = event.clientY - previousMousePositionRef.current.y;

      targetCamPosRef.current.x -= deltaX * 0.035;
      targetCamPosRef.current.y = Math.max(3, Math.min(26, targetCamPosRef.current.y + deltaY * 0.035));
      previousMousePositionRef.current = { x: event.clientX, y: event.clientY };
    };

    const handleWheel = (event) => {
      event.preventDefault();
      if (cameraMode === 'pov') return;
      targetCamPosRef.current.z = Math.max(8, Math.min(38, targetCamPosRef.current.z + event.deltaY * 0.03));
      targetCamPosRef.current.y = Math.max(4, Math.min(28, targetCamPosRef.current.y + event.deltaY * 0.015));
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('pointermove', handlePointerMove);
    domElement.addEventListener('pointermove', handleDragMove);
    domElement.addEventListener('pointerdown', handlePointerDown);
    domElement.addEventListener('pointerup', handlePointerUp);
    domElement.addEventListener('wheel', handleWheel, { passive: false });

    const handleResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // ================== ANIMATION LOOP ==================
    let animationFrameId;
    let clock = new THREE.Clock();
    let frameCounter = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();
      frameCounter++;

      // Lerp camera
      camera.position.lerp(targetCamPosRef.current, 0.07);
      currentCamLookRef.current.lerp(targetCamLookRef.current, 0.07);
      camera.lookAt(currentCamLookRef.current);

      // Flickering cinema beam & projector dynamic light
      const beamFlicker = Math.sin(time * 8) * 0.02 + Math.cos(time * 14) * 0.01;
      beamMat.opacity = 0.08 + beamFlicker;
      screenLight.intensity = 5.2 + Math.sin(time * 3) * 0.7;

      // Update screen texture every 3 frames
      if (frameCounter % 3 === 0) {
        drawScreenContent(frameCounter);
        screenTexture.needsUpdate = true;
      }

      // Animate floating dust motes
      const positions = dustParticles.geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 1] += particleVelocities[i].y;
        positions[i * 3] += particleVelocities[i].x;
        positions[i * 3 + 2] += particleVelocities[i].z;

        // Reset if drifted out of bounds
        if (positions[i * 3 + 1] > 16) positions[i * 3 + 1] = 1;
        if (positions[i * 3 + 1] < 1) positions[i * 3 + 1] = 16;
        if (positions[i * 3] > 10) positions[i * 3] = -10;
        if (positions[i * 3] < -10) positions[i * 3] = 10;
      }
      dustParticles.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      domElement.removeEventListener('pointermove', handlePointerMove);
      domElement.removeEventListener('pointermove', handleDragMove);
      domElement.removeEventListener('pointerdown', handlePointerDown);
      domElement.removeEventListener('pointerup', handlePointerUp);
      domElement.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      mount.innerHTML = '';
    };
  }, [seatsData, selectedSeats, movieTitle, showType, experience]);

  return (
    <div className="relative w-full h-[540px] rounded-3xl overflow-hidden border border-cyan-500/30 bg-[#05070c] shadow-2xl shadow-cyan-950/50">
      {/* 3D Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* 3D Glasses Polarized Depth Simulation Filter (Stereoscopic Overlays) */}
      {glassesMode && (
        <div className="absolute inset-0 pointer-events-none z-10 mix-blend-screen opacity-20 bg-gradient-to-r from-red-500/30 via-transparent to-cyan-500/30 animate-pulse" />
      )}

      {/* Top HUD Bar */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none z-20">
        <div className="flex items-center gap-2 pointer-events-auto bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10 text-xs text-slate-300">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-sm shadow-cyan-400" />
          <span className="font-bold text-white tracking-wide">
            {showType === '3D' ? 'IMAX 3D LASER AUDITORIUM' : 'DOLBY ATMOS 2D CINEMA'}
          </span>
          <span className="text-slate-500">|</span>
          <span className="text-[11px] text-cyan-300">Drag to Orbit • Scroll to Zoom</span>
        </div>

        {/* Camera & 3D Glasses Controls */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Virtual 3D Glasses Mode Button */}
          {showType === '3D' && (
            <button
              onClick={() => {
                sound.playClick();
                setGlassesMode(prev => !prev);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                glassesMode
                  ? 'bg-gradient-to-r from-red-500 to-cyan-500 text-white border-transparent shadow-lg shadow-cyan-500/30 animate-pulse'
                  : 'bg-black/70 text-slate-300 border-white/10 hover:border-white/20'
              }`}
              title="Toggle Stereoscopic 3D Glasses Simulation"
            >
              <Glasses className="w-4 h-4" />
              <span>{glassesMode ? '3D Glasses ON' : '3D Glasses OFF'}</span>
            </button>
          )}

          {/* Camera Angles */}
          <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md p-1.5 rounded-xl border border-cyan-500/30 shadow-lg">
            <button
              onClick={() => {
                setCameraMode('hall');
                sound.playClick();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                cameraMode === 'hall'
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Auditorium</span>
            </button>

            <button
              onClick={() => {
                setCameraMode('screen');
                sound.playClick();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                cameraMode === 'screen'
                  ? 'bg-cyan-500 text-black shadow-md shadow-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Screen</span>
            </button>

            <button
              onClick={() => {
                setCameraMode('pov');
                sound.playClick();
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                cameraMode === 'pov'
                  ? 'bg-gradient-to-r from-amber-400 to-amber-500 text-black shadow-md shadow-amber-500/40'
                  : 'text-amber-400 hover:text-amber-300'
              }`}
              title="First-Person Seat View"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Seat POV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Hover Tooltip HUD */}
      {hoveredSeat && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 pointer-events-none z-30 transition-all duration-150">
          <div className="bg-slate-900/95 backdrop-blur-xl border border-cyan-400/50 px-5 py-2.5 rounded-2xl shadow-2xl shadow-black flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-mono text-lg font-black text-cyan-400">{hoveredSeat.id}</span>
              <span
                className={`px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${
                  hoveredSeat.tier === 'VIP'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : hoveredSeat.tier === 'Executive'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                }`}
              >
                {hoveredSeat.tier} Lounger
              </span>
            </div>

            <div className="text-slate-300">
              <span className="font-mono text-base font-black text-white">₹{hoveredSeat.price}</span>
            </div>

            <div>
              {hoveredSeat.isBooked ? (
                <span className="text-rose-400 font-bold">Sold Out</span>
              ) : selectedSeats.includes(hoveredSeat.id) ? (
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Selected
                </span>
              ) : (
                <span className="text-cyan-300 font-medium">Click to Select</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Legend Bar */}
      <div className="absolute bottom-3 left-4 right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none z-20 bg-black/75 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/10 text-xs">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-[#b45309] border border-amber-400 shadow-sm shadow-amber-500/50" />
            <span className="text-amber-200">VIP (₹480)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-[#0284c7] border border-sky-400 shadow-sm shadow-sky-500/50" />
            <span className="text-sky-200">Executive (₹340)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-[#475569] border border-slate-400" />
            <span className="text-slate-300">Classic (₹220)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-[#00f5ff] shadow-md shadow-cyan-400 animate-pulse" />
            <span className="text-cyan-300 font-bold">Selected Seat</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-[#111622] border border-slate-800" />
            <span className="text-slate-600">Reserved</span>
          </div>
        </div>

        <div className="text-[11px] text-cyan-400 font-mono tracking-wider">
          {showType === '3D' ? '🕶️ VOLUMETRIC 3D LIGHT ACTIVE' : '🎬 2D RGB LASER MASTER'}
        </div>
      </div>
    </div>
  );
}
