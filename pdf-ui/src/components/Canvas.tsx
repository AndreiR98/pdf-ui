"use client";

import React, { useRef, useState } from 'react';
import { PDFComponent, Shape, Image, TextArea } from '@/types/types';

interface CanvasProps {
    components: PDFComponent[];
    selectedComponent: PDFComponent | null;
    onSelectComponent: (component: PDFComponent | null) => void;
    onUpdateComponent: (id: string, updates: Partial<PDFComponent>) => void;
    onDrop: (x: number, y: number, type: string) => void;
}

interface Position {
    x: number;
    y: number;
}

// Constants for measurements
const MM_TO_PX = 3.779527559; // 1mm = 3.779527559px
const PAGE_WIDTH_MM = 210;
const PAGE_HEIGHT_MM = 297;
const GRID_STEP = 10; // 10mm major grid
const SMALL_GRID_STEP = 5; // 5mm minor grid

export const Canvas: React.FC<CanvasProps> = ({
                                                  components,
                                                  selectedComponent,
                                                  onSelectComponent,
                                                  onUpdateComponent,
                                                  onDrop
                                              }) => {
    const paperRef = useRef<HTMLDivElement>(null);
    const [draggingComponent, setDraggingComponent] = useState<PDFComponent | null>(null);
    const [dragOffset, setDragOffset] = useState<Position | null>(null);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (!paperRef.current) return;

        const rect = paperRef.current.getBoundingClientRect();
        const x = Math.max(0, e.clientX - rect.left);
        const y = Math.max(0, e.clientY - rect.top);
        const componentType = e.dataTransfer.getData('text/plain');
        onDrop(x, y, componentType);
    };

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, component: PDFComponent) => {
        e.stopPropagation();
        if (e.button !== 0) return;

        const rect = e.currentTarget.getBoundingClientRect();
        setDraggingComponent(component);
        setDragOffset({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        });
        onSelectComponent(component);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!draggingComponent || !dragOffset || !paperRef.current) return;

        const rect = paperRef.current.getBoundingClientRect();
        const newX = Math.max(0, e.clientX - rect.left - dragOffset.x);
        const newY = Math.max(0, e.clientY - rect.top - dragOffset.y);

        const width = 'width' in draggingComponent ? draggingComponent.width : 0;
        const height = 'height' in draggingComponent ? draggingComponent.height : 0;

        const maxX = rect.width - width;
        const maxY = rect.height - height;

        // Snap to grid (10mm intervals)
        const snapToGrid = (value: number) => {
            const gridSize = GRID_STEP * MM_TO_PX;
            return Math.round(value / gridSize) * gridSize;
        };

        onUpdateComponent(draggingComponent.id, {
            x: Math.min(maxX, Math.max(0, snapToGrid(newX))),
            y: Math.min(maxY, Math.max(0, snapToGrid(newY)))
        });
    };

    const handleMouseUp = () => {
        setDraggingComponent(null);
        setDragOffset(null);
    };

    const renderComponent = (component: PDFComponent) => {
        switch (component.type) {
            case 'text':
                const textComponent = component as TextArea;
                return (
                    <textarea
                        className="w-full h-full resize-none border-none focus:outline-none bg-transparent p-2"
                        value={textComponent.content}
                        onChange={(e) => onUpdateComponent(component.id, { content: e.target.value })}
                        style={textComponent.style}
                        placeholder="Enter text"
                    />
                );
            case 'image':
                const imageComponent = component as Image;
                return (
                    <img
                        src={imageComponent.src}
                        alt={imageComponent.alt || "PDF component"}
                        className="w-full h-full object-contain"
                        draggable={false}
                    />
                );
            case 'rectangle':
            case 'circle':
            case 'line':
                const shapeComponent = component as Shape;
                return (
                    <div
                        className={`w-full h-full ${component.type === 'circle' ? 'rounded-full' : ''}`}
                        style={{
                            backgroundColor: shapeComponent.fillColor || 'transparent',
                            border: `${shapeComponent.strokeWidth || 1}px solid ${shapeComponent.strokeColor || '#000000'}`
                        }}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="flex-1 p-12 flex justify-center overflow-auto bg-gray-100">
            <div className="relative">
                {/* Horizontal Ruler */}
                <div className="absolute -top-8 left-8 right-0 h-8 bg-white border-b border-gray-300 flex select-none">
                    {Array.from({ length: Math.ceil(PAGE_WIDTH_MM / GRID_STEP) }).map((_, i) => (
                        <div key={`h-${i}`} className="relative" style={{ width: `${GRID_STEP * MM_TO_PX}px` }}>
                            <div className="absolute bottom-0 left-0 w-px h-2 bg-gray-400" />
                            {i % 2 === 0 && (
                                <span className="absolute bottom-3 left-1 text-xs text-gray-600">
                                    {i * GRID_STEP}
                                </span>
                            )}
                            <div className="absolute bottom-0 left-1/2 w-px h-1.5 bg-gray-300" />
                        </div>
                    ))}
                </div>

                {/* Vertical Ruler */}
                <div className="absolute top-0 -left-8 w-8 bottom-0 bg-white border-r border-gray-300 flex flex-col select-none">
                    {Array.from({ length: Math.ceil(PAGE_HEIGHT_MM / GRID_STEP) }).map((_, i) => (
                        <div key={`v-${i}`} className="relative" style={{ height: `${GRID_STEP * MM_TO_PX}px` }}>
                            <div className="absolute right-0 top-0 h-px w-2 bg-gray-400" />
                            {i % 2 === 0 && (
                                <span className="absolute right-3 -top-1 text-xs text-gray-600">
                                    {i * GRID_STEP}
                                </span>
                            )}
                            <div className="absolute right-0 top-1/2 h-px w-1.5 bg-gray-300" />
                        </div>
                    ))}
                </div>

                {/* Corner Label */}
                <div className="absolute -top-8 -left-8 w-8 h-8 bg-white border-b border-r border-gray-300 z-10">
                    <div className="text-xs text-gray-500 absolute bottom-1 right-1">mm</div>
                </div>

                {/* Main Canvas */}
                <div
                    ref={paperRef}
                    className="w-[210mm] h-[297mm] bg-white shadow-lg relative"
                    style={{
                        width: `${PAGE_WIDTH_MM * MM_TO_PX}px`,
                        height: `${PAGE_HEIGHT_MM * MM_TO_PX}px`
                    }}
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                >
                    {/* Grid Background */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div
                            className="w-full h-full"
                            style={{
                                backgroundImage: `
                                    linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
                                    linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
                                `,
                                backgroundSize: `${GRID_STEP * MM_TO_PX}px ${GRID_STEP * MM_TO_PX}px`
                            }}
                        />
                        <div
                            className="w-full h-full"
                            style={{
                                backgroundImage: `
                                    linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                                    linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
                                `,
                                backgroundSize: `${SMALL_GRID_STEP * MM_TO_PX}px ${SMALL_GRID_STEP * MM_TO_PX}px`
                            }}
                        />
                    </div>

                    {/* Components */}
                    {components.map((component) => (
                        <div
                            key={component.id}
                            className={`absolute transition-transform ${
                                draggingComponent?.id === component.id ? 'cursor-grabbing' : 'cursor-grab'
                            } ${selectedComponent?.id === component.id ? 'ring-2 ring-blue-500' : ''}`}
                            style={{
                                left: component.x,
                                top: component.y,
                                width: 'width' in component ? component.width : 100,
                                height: 'height' in component ? component.height : 100,
                                transform: draggingComponent?.id === component.id ? 'scale(1.02)' : 'scale(1)',
                                zIndex: draggingComponent?.id === component.id ? 999 : 1
                            }}
                            onMouseDown={(e) => handleMouseDown(e, component)}
                        >
                            {renderComponent(component)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};