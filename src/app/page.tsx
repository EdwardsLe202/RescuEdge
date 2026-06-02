"use client";

import React, { useState, useEffect, useRef } from "react";
import { ChevronRight, MapPin, MessageSquare } from "lucide-react";

// Import modular components
import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import MetricCards from "@/components/MetricCards";
import VideoPlayer from "@/components/VideoPlayer";
import TimelineFlow from "@/components/TimelineFlow";
import CommentsSidebar, { Comment } from "@/components/CommentsSidebar";

export default function Home() {
  // Navigation State
  const [activeMenu, setActiveMenu] = useState("dashboard");
  
  // Dashboard Information States
  const [locations, setLocations] = useState([
    { id: 1, name: "Malviya Nagar" },
    { id: 2, name: "Jaipur Highway" },
    { id: 3, name: "Subhash Nagar" }
  ]);
  
  const [cameras, setCameras] = useState([
    { id: 1, name: "Backstory H.No-75 H" },
    { id: 2, name: "Front Entry Shop A" },
    { id: 3, name: "Exit Corridor B" }
  ]);

  // UI Interactive States
  const [searchQuery, setSearchQuery] = useState("");
  const [isCommentsOpen, setIsCommentsOpen] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "Abhay Salvi",
      avatar: "AS",
      role: "Sub Admin Dept. of Forensic",
      content: "Issue is set to be resolved. Evidence files extracted successfully.",
      timestamp: "Nov 22 01:40 PM",
    },
    {
      id: "2",
      author: "Arpit Nagar",
      avatar: "AN",
      role: "Sub Admin Dept. of Investigation",
      content: "There has been a suspect in the past backside of the store near Malviya road.",
      timestamp: "Today at 02:10 PM",
    },
    {
      id: "3",
      author: "Arpit Nagar",
      avatar: "AN",
      role: "Sub Admin Dept. of Investigation",
      content: "@AbhaySalvi move forward, proceed to tag this location for standard patrols.",
      timestamp: "Today at 02:10 PM",
      isTagged: true,
    },
  ]);

  // Video Player Logic & Simulation
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(2336); // Initial: 38:56 (in seconds)
  const duration = 6990; // 1:56:30 (in seconds)
  const [playbackSpeed, setPlaybackSpeed] = useState(1.25);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [selectedLocation, setSelectedLocation] = useState("Malviya Nagar");
  const [selectedCamera, setSelectedCamera] = useState("Backstory H.No-75 H");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // Synchronized simulation variables
  const ClerkX = 140;
  const ClerkY = 170;
  const SuspectX = 350;
  const SuspectY = 180;

  // Format seconds to hh:mm:ss or mm:ss
  const formatTime = (timeInSecs: number) => {
    const hrs = Math.floor(timeInSecs / 3600);
    const mins = Math.floor((timeInSecs % 3600) / 60);
    const secs = Math.floor(timeInSecs % 60);
    
    const displayMins = mins < 10 ? `0${mins}` : mins;
    const displaySecs = secs < 10 ? `0${secs}` : secs;

    if (hrs > 0) {
      return `${hrs}:${displayMins}:${displaySecs}`;
    }
    return `${displayMins}:${displaySecs}`;
  };

  // Video Canvas Mock Drawing Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameCount = 0;

    const render = () => {
      frameCount++;
      
      // Clear Canvas
      ctx.fillStyle = "#1e1e2e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Mock Convenience Store Background
      ctx.fillStyle = "#2c2c3e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Back Shelves & Items
      ctx.fillStyle = "#1b1b2a";
      ctx.fillRect(40, 60, 480, 100);
      
      // Drawing horizontal shelves
      ctx.strokeStyle = "#44445c";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(40, 95); ctx.lineTo(520, 95);
      ctx.moveTo(40, 130); ctx.lineTo(520, 130);
      ctx.moveTo(40, 160); ctx.lineTo(520, 160);
      ctx.stroke();

      // Draw shelf items (grid of colorful blocks)
      const colors = ["#e74c3c", "#f1c40f", "#2ecc71", "#3498db", "#9b59b6", "#e67e22"];
      ctx.fillStyle = "#e74c3c";
      for (let s = 0; s < 3; s++) {
        const yPos = 65 + s * 35;
        for (let item = 0; item < 18; item++) {
          if ((item + s) % 3 !== 0) {
            ctx.fillStyle = colors[(item + s * 4) % colors.length];
            ctx.fillRect(50 + item * 25, yPos, 14, 25);
          }
        }
      }

      // Checkout Counter / Cash Register Table
      ctx.fillStyle = "#1e1e2e";
      ctx.fillRect(60, 210, 320, 90);
      ctx.fillStyle = "#0c0c16";
      ctx.fillRect(80, 205, 70, 30); // Register table left
      
      // Store Front Glass Window/Wall at the back
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(520, 0); ctx.lineTo(520, canvas.height);
      ctx.stroke();

      // Clerk Behind Counter
      ctx.fillStyle = "#f5c59f"; // Face
      ctx.beginPath();
      ctx.arc(ClerkX, ClerkY - 30, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#4a90e2"; // Cap
      ctx.fillRect(ClerkX - 16, ClerkY - 48, 32, 10);
      ctx.fillStyle = "#e67e22"; // Uniform Shirt
      ctx.beginPath();
      ctx.moveTo(ClerkX - 25, ClerkY - 15);
      ctx.lineTo(ClerkX + 25, ClerkY - 15);
      ctx.lineTo(ClerkX + 20, ClerkY + 40);
      ctx.lineTo(ClerkX - 20, ClerkY + 40);
      ctx.closePath();
      ctx.fill();

      // Cash Register details
      ctx.fillStyle = "#333344";
      ctx.fillRect(ClerkX + 35, ClerkY - 10, 45, 30);
      ctx.fillStyle = "#444455";
      ctx.fillRect(ClerkX + 45, ClerkY - 25, 25, 20); // Screen

      // Suspect/Customer in Front
      ctx.fillStyle = "#e2b694"; // Suspect Face
      ctx.beginPath();
      ctx.arc(SuspectX + (Math.sin(frameCount * 0.05) * 2), SuspectY - 30, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#1a1a2e"; // Dark Hoodie
      ctx.beginPath();
      ctx.arc(SuspectX + (Math.sin(frameCount * 0.05) * 2), SuspectY - 32, 18, Math.PI, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#2c3e50"; // Pants
      ctx.fillRect(SuspectX - 15, SuspectY + 50, 30, 70);
      ctx.fillStyle = "#111116"; // Dark Hoodie Jacket
      ctx.beginPath();
      ctx.moveTo(SuspectX - 28, SuspectY - 14);
      ctx.lineTo(SuspectX + 28, SuspectY - 14);
      ctx.lineTo(SuspectX + 22, SuspectY + 60);
      ctx.lineTo(SuspectX - 22, SuspectY + 60);
      ctx.closePath();
      ctx.fill();

      // Suspect's Arm stretched pointing a gun/item towards register
      ctx.strokeStyle = "#111116";
      ctx.lineWidth = 12;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(SuspectX - 10, SuspectY + 10);
      ctx.lineTo(SuspectX - 85 + (Math.sin(frameCount * 0.05) * 2), SuspectY - 8);
      ctx.stroke();

      // The weapon/gun object held by the suspect
      ctx.fillStyle = "#33333b";
      ctx.fillRect(SuspectX - 98 + (Math.sin(frameCount * 0.05) * 2), SuspectY - 18, 22, 10);
      ctx.fillRect(SuspectX - 86 + (Math.sin(frameCount * 0.05) * 2), SuspectY - 12, 8, 14);

      // AI Bounding Box Overlays rendered on Canvas
      ctx.strokeStyle = `rgba(239, 68, 68, ${0.8 + Math.sin(frameCount * 0.1) * 0.2})`;
      ctx.lineWidth = 2;
      ctx.strokeRect(SuspectX - 105 + (Math.sin(frameCount * 0.05) * 2), SuspectY - 26, 38, 42);
      
      // Suspect Body highlight box
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(SuspectX - 35, SuspectY - 54, 70, 160);

      // Scanline static overlay effect
      ctx.fillStyle = "rgba(255, 255, 255, 0.015)";
      for (let y = 0; y < canvas.height; y += 4) {
        ctx.fillRect(0, y, canvas.width, 1.5);
      }

      // Simulated Security Camera Text Overlay
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
      ctx.font = "bold 13px 'Courier New', Courier, monospace";
      ctx.fillText("CAM-01 BACKSTORY 75-H", 20, 30);
      
      // Pulsing Live Indicator
      ctx.fillStyle = `rgba(239, 68, 68, ${0.7 + Math.sin(frameCount * 0.15) * 0.3})`;
      ctx.beginPath();
      ctx.arc(430, 25, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillText("LIVE", 442, 30);

      // Custom Timestamp updating based on currentTime
      const formattedTime = formatTime(currentTime);
      ctx.fillText(`TIME: ${formattedTime} / 1:56:30`, 20, 370);
      ctx.fillText("RATE: 15.0 fps", 430, 370);

      // High severity glowing text
      ctx.fillStyle = "#ef4444";
      ctx.fillText("🚨 WARNING: ARMED SUSPECT DETECTED", 20, 335);

      if (isPlaying) {
        animationRef.current = requestAnimationFrame(render);
      }
    };

    if (isPlaying) {
      animationRef.current = requestAnimationFrame(render);
    } else {
      render(); // Render once if paused
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, currentTime]);

  // Video Playing Progress Timer Loop
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prevTime) => {
          const nextTime = prevTime + 1 * playbackSpeed;
          if (nextTime >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return nextTime;
        });
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playbackSpeed]);

  // Action: Add new comment
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const added: Comment = {
      id: String(comments.length + 1),
      author: "Edward (Admin)",
      avatar: "ED",
      role: "Lead Security Officer",
      content: newComment,
      timestamp: "Just now",
    };

    setComments([...comments, added]);
    setNewComment("");
  };

  // Timeline seeking click handler
  const handleTimelineClick = (secs: number) => {
    setCurrentTime(secs);
  };

  // Quick navigation: add/change location camera
  const handleAddNewLocation = () => {
    const locName = prompt("Enter new location name:");
    if (locName) {
      const newLoc = { id: locations.length + 1, name: locName };
      setLocations([...locations, newLoc]);
    }
  };

  const handleAddNewCamera = () => {
    const camName = prompt("Enter new camera name:");
    if (camName) {
      const newCam = { id: cameras.length + 1, name: camName };
      setCameras([...cameras, newCam]);
    }
  };

  return (
    <main className="w-screen h-screen bg-white text-[#1e293b] font-sans flex flex-col overflow-hidden selection:bg-indigo-200 selection:text-indigo-900 relative">
      <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        <Sidebar
          activeMenu={activeMenu}
          setActiveMenu={setActiveMenu}
          locations={locations}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          cameras={cameras}
          selectedCamera={selectedCamera}
          setSelectedCamera={setSelectedCamera}
          onAddNewLocation={handleAddNewLocation}
          onAddNewCamera={handleAddNewCamera}
        />

        <section className="flex-1 flex flex-col p-6 overflow-y-auto min-h-0 bg-[#f8fafc]">
          {/* Breadcrumb Navigation trail */}
          <nav className="text-[11px] font-medium text-gray-400 mb-2 flex items-center gap-1.5">
            <span>Dashboard</span>
            <ChevronRight className="w-3 h-3 text-gray-300" />
            <span className="hover:text-gray-600 transition-colors cursor-pointer">{selectedLocation}</span>
            <ChevronRight className="w-3 h-3 text-gray-300" />
            <span className="text-indigo-600 font-semibold">{selectedCamera}</span>
          </nav>

          {/* Location Title Header info */}
          <div className="mb-5">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 leading-snug">
              {selectedCamera}, {selectedLocation}, Jaipur Rd
            </h2>
            <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-1">
              <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
              75-H, {selectedLocation}, Opp. Kabir Marg Tonk Road, Jaipur, Rajasthan, 303135
            </p>
          </div>

          <MetricCards />

          <VideoPlayer
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            currentTime={currentTime}
            setCurrentTime={setCurrentTime}
            duration={duration}
            playbackSpeed={playbackSpeed}
            setPlaybackSpeed={setPlaybackSpeed}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            volume={volume}
            setVolume={setVolume}
            canvasRef={canvasRef}
            formatTime={formatTime}
          />

          <TimelineFlow
            currentTime={currentTime}
            duration={duration}
            handleTimelineClick={handleTimelineClick}
          />
        </section>

        <CommentsSidebar
          isCommentsOpen={isCommentsOpen}
          setIsCommentsOpen={setIsCommentsOpen}
          comments={comments}
          newComment={newComment}
          setNewComment={setNewComment}
          onAddComment={handleAddComment}
        />

        {/* Floater arrow button to open the comments log if collapsed */}
        {!isCommentsOpen && (
          <button
            onClick={() => setIsCommentsOpen(true)}
            className="absolute right-4 top-4 z-40 w-10 h-10 rounded-full bg-white hover:bg-gray-50 text-indigo-600 shadow-xl border border-indigo-100 flex items-center justify-center cursor-pointer hover:scale-105 transition-all"
            title="Expand comments panel"
          >
            <MessageSquare className="w-5 h-5 text-indigo-600 animate-pulse" />
          </button>
        )}
      </div>
    </main>
  );
}
