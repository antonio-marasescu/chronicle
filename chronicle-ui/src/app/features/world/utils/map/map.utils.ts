import { DrawMetrics, OffsetPoint, Point } from '../../types/map-render.types';

export function computeDrawMetrics(
  canvasWidth: number,
  canvasHeight: number,
  imageWidth: number,
  imageHeight: number
): DrawMetrics {
  const scale = Math.min(canvasWidth / imageWidth, canvasHeight / imageHeight);
  const drawOffsetX = (canvasWidth - imageWidth * scale) / 2;
  const drawOffsetY = (canvasHeight - imageHeight * scale) / 2;
  return { drawOffsetX, drawOffsetY, scale };
}

export function clampOffset(
  offsetX: number,
  offsetY: number,
  imageWidth: number,
  imageHeight: number,
  zoom: number
): OffsetPoint {
  const maxOffsetX = imageWidth - imageWidth / zoom;
  const maxOffsetY = imageHeight - imageHeight / zoom;
  return {
    offsetX: Math.max(0, Math.min(offsetX, maxOffsetX)),
    offsetY: Math.max(0, Math.min(offsetY, maxOffsetY))
  };
}

export function screenToWorld(
  screenX: number,
  screenY: number,
  metrics: DrawMetrics,
  zoom: number,
  offsetX: number,
  offsetY: number
): Point {
  return {
    x: (screenX - metrics.drawOffsetX) / (metrics.scale * zoom) + offsetX,
    y: (screenY - metrics.drawOffsetY) / (metrics.scale * zoom) + offsetY
  };
}

export function worldToScreen(
  worldX: number,
  worldY: number,
  metrics: DrawMetrics,
  zoom: number,
  offsetX: number,
  offsetY: number
): Point {
  return {
    x: metrics.drawOffsetX + (worldX - offsetX) * zoom * metrics.scale,
    y: metrics.drawOffsetY + (worldY - offsetY) * zoom * metrics.scale
  };
}
