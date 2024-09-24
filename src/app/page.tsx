"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Eraser,
  Image,
  Layers,
  Wand2,
  Crop,
  Moon,
  Sun,
  Paintbrush,
  Square,
  Circle,
  Undo,
  Redo,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

type DrawingTool = "brush" | "eraser" | "rectangle" | "circle";

export default function LandingPage() {
  const [prompt, setPrompt] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [eraserSize, setEraserSize] = useState(4);
  const [currentTool, setCurrentTool] = useState<DrawingTool>("brush");
  const [startPosition, setStartPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [history, setHistory] = useState<ImageData[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [cursor, setCursor] = useState("none");
  const [isLoading, setIsLoading] = useState(true);

  const colorOptions = [
    "#000000",
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFFF00",
    "#FF00FF",
    "#00FFFF",
  ];

  useEffect(() => {
    setMounted(true);
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.fillStyle = theme === "dark" ? "black" : "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveToHistory(ctx.getImageData(0, 0, canvas.width, canvas.height));
      }
    }
    // Simulate loading delay
    setTimeout(() => setIsLoading(false), 1500);
  }, [theme]);

  const saveToHistory = (imageData: ImageData) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(imageData);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    setStartPosition({ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY });
    console.log({ currentTool });

    if (currentTool === "brush" || currentTool === "eraser") {
      draw(e);
    }
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    setStartPosition(null);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      ctx.beginPath();
      saveToHistory(ctx.getImageData(0, 0, canvas!.width, canvas!.height));
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    console.log(currentTool);

    if (ctx && canvas) {
      ctx.lineWidth = currentTool === "brush" ? brushSize : eraserSize;
      console.log(currentTool);

      ctx.lineCap = "round";
      ctx.strokeStyle =
        currentTool === "eraser"
          ? theme === "dark"
            ? "#000000"
            : "#FFFFFF"
          : color;

      if (currentTool === "brush" || currentTool === "eraser") {
        ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
      } else if (startPosition) {
        const { x, y } = startPosition;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.putImageData(history[historyIndex], 0, 0);
        if (currentTool === "rectangle") {
          ctx.strokeRect(
            x,
            y,
            e.nativeEvent.offsetX - x,
            e.nativeEvent.offsetY - y
          );
        } else if (currentTool === "circle") {
          const radius = Math.sqrt(
            Math.pow(e.nativeEvent.offsetX - x, 2) +
              Math.pow(e.nativeEvent.offsetY - y, 2)
          );
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, 2 * Math.PI);
          ctx.stroke();
        }
      }
    }
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (ctx && canvas) {
        ctx.putImageData(history[historyIndex - 1], 0, 0);
      }
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");
      if (ctx && canvas) {
        ctx.putImageData(history[historyIndex + 1], 0, 0);
      }
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) return null;

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="px-4 lg:px-6 h-14 flex items-center border-b border-gray-200 dark:border-gray-700">
        <Link className="flex items-center justify-center" href="#">
          <Wand2 className="h-6 w-6" />
          <span className="ml-2 font-bold hidden sm:block">PhotoEditPro</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Pricing
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            About
          </Link>
          <Link
            className="text-sm font-medium hover:underline underline-offset-4"
            href="#"
          >
            Contact
          </Link>
        </nav>
        <div className="flex items-center ml-4">
          <Switch
            id="theme-toggle"
            checked={theme === "dark"}
            onCheckedChange={toggleTheme}
          />
          <Label htmlFor="theme-toggle" className="ml-2">
            {theme === "dark" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Label>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Transform Your Photos with PhotoEditPro
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 dark:text-gray-400 md:text-xl">
                  Professional-grade photo editing tools at your fingertips.
                  Enhance, retouch, and perfect your images with ease.
                </p>
              </div>
              <div className="space-x-4">
                <Button>Get Started</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Our Services
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader>
                  <Eraser className="w-8 h-8 mb-2" />
                  <CardTitle>Background Removal</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Remove backgrounds with precision, perfect for product
                    photos and portraits.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Layers className="w-8 h-8 mb-2" />
                  <CardTitle>Photo Retouching</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Enhance and retouch your photos to achieve a flawless,
                    professional look.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Image className="w-8 h-8 mb-2" />
                  <CardTitle>Image Restoration</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Restore old or damaged photos to their former glory with our
                    advanced tools.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <Crop className="w-8 h-8 mb-2" />
                  <CardTitle>Image Cropping</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Precisely crop and resize your images to perfectly fit your
                    needs and requirements.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Try Our Enhanced Drawing Tool
            </h2>
            <div className="flex flex-col items-center space-y-4">
              <div className="flex space-x-2 mb-4">
                <Button
                  variant={currentTool === "brush" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setCurrentTool("brush")}
                >
                  <Paintbrush className="h-4 w-4" />
                </Button>
                <Button
                  variant={currentTool === "eraser" ? "default" : "outline"}
                  size="icon"
                  onClick={() => setCurrentTool("eraser")}
                >
                  <Eraser className="h-4 w-4" />
                </Button>
                <Button
                  variant={currentTool === "rectangle" ? "default" : "outline"}
                  size="icon"
                  onClick={() => {
                    setCurrentTool("rectangle");
                    setCursor("crosshair");
                  }}
                >
                  <Square className="h-4 w-4" />
                </Button>
                <Button
                  variant={currentTool === "circle" ? "default" : "outline"}
                  size="icon"
                  onClick={() => {
                    setCurrentTool("circle");
                    setCursor("crosshair");
                  }}
                >
                  <Circle className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={undo}
                  disabled={historyIndex <= 0}
                >
                  <Undo className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={redo}
                  disabled={historyIndex >= history.length - 1}
                >
                  <Redo className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-sm">Color:</span>
                <div className="flex space-x-1">
                  {colorOptions.map((c) => (
                    <button
                      key={c}
                      className={`w-6 h-6 rounded-full ${
                        color === c ? "ring-2 ring-offset-2 ring-blue-500" : ""
                      }`}
                      style={{ backgroundColor: c }}
                      onClick={() => setColor(c)}
                    />
                  ))}
                </div>
                <Input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-10 h-10 p-1 rounded-md"
                />
              </div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-sm">
                  {currentTool == "brush" ? "Brush" : "Eraser"} Size:
                </span>
                <Slider
                  value={[currentTool === "brush" ? brushSize : eraserSize]}
                  onValueChange={(value) =>
                    currentTool === "brush"
                      ? setBrushSize(value[0])
                      : setEraserSize(value[0])
                  }
                  max={50}
                  step={1}
                  className="w-[200px] cursor-pointer"
                />
                <span className="text-sm">
                  {currentTool === "brush" ? brushSize : eraserSize}px
                </span>
              </div>
              {isLoading ? (
                <Skeleton className="w-[500px] h-[300px] rounded-md" />
              ) : (
                <canvas
                  ref={canvasRef}
                  onMouseDown={startDrawing}
                  onMouseUp={stopDrawing}
                  onMouseOut={stopDrawing}
                  onMouseMove={draw}
                  className={`border border-gray-300 dark:border-gray-700 bg-white dark:bg-black rounded-md cursor-${cursor} w-[90%] h-auto`}
                  style={{ aspectRatio: "16 / 9" }}
                />
              )}
              <div className="w-full max-w-md space-y-2">
                <Input
                  type="text"
                  placeholder="Enter a prompt for AI-assisted drawing"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <Button className="w-full">Generate AI Drawing</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 PhotoEditPro. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
