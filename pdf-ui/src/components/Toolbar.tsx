"use client";

import React, { useState, useRef, useEffect } from 'react';
import {PDFComponent, ComponentType, Image, Shape, TextArea} from '@/types/types';
import {
    Type,
    Square,
    Circle,
    Image as ImageIcon,
    Bold,
    Italic,
    Underline,
    Undo2,
    Redo2,
    Palette,
    Settings,
    Save,
    ChevronDown
} from 'lucide-react';

interface ToolbarProps {
    onUndo: () => void;
    onRedo: () => void;
    selectedComponent: PDFComponent | null;
    onStyleChange: (styleUpdate: React.CSSProperties) => void;
    onAddComponent: (type: ComponentType) => void;
    components: PDFComponent[];
}

interface PDFTemplate {
    type: "PDF";
    format: "A4";
    name: string;
    components: PDFComponent[];
}

export const Toolbar: React.FC<ToolbarProps> = ({
                                                    onUndo,
                                                    onRedo,
                                                    selectedComponent,
                                                    onStyleChange,
                                                    onAddComponent,
                                                    components = []
                                                }) => {
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [templateName, setTemplateName] = useState('');
    const [showNameInput, setShowNameInput] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleSaveTemplate = () => {
        if (!templateName.trim()) {
            setShowNameInput(true);
            return;
        }

        // Log components before processing for debugging
        console.log('Raw components:', components);

        // Create clean components array with only necessary properties
        const cleanComponents = components.map(comp => {
            // Ensure we're getting the proper type casting
            let cleanComponent: any = {
                id: comp.id,
                type: comp.type,
                x: comp.x,
                y: comp.y,
            };

            switch (comp.type) {
                case 'text':
                    const textComp = comp as TextArea;
                    cleanComponent = {
                        ...cleanComponent,
                        content: textComp.content || '',
                        width: textComp.width || 100,
                        height: textComp.height || 50,
                        style: {
                            fontFamily: textComp.style?.fontFamily || 'Arial',
                            fontSize: textComp.style?.fontSize || '16px',
                            fontWeight: textComp.style?.fontWeight || 'normal',
                            fontStyle: textComp.style?.fontStyle || 'normal',
                            textDecoration: textComp.style?.textDecoration || 'none',
                            color: textComp.style?.color || '#000000',
                        }
                    };
                    break;

                case 'rectangle':
                case 'circle':
                    const shapeComp = comp as Shape;
                    cleanComponent = {
                        ...cleanComponent,
                        width: shapeComp.width || 100,
                        height: shapeComp.height || 100,
                        strokeColor: shapeComp.strokeColor || '#000000',
                        strokeWidth: shapeComp.strokeWidth || 1,
                        fillColor: shapeComp.fillColor || 'transparent',
                        ...(comp.type === 'circle' ? { radius: shapeComp.radius || 50 } : {})
                    };
                    break;

                case 'line':
                    const lineComp = comp as Shape;
                    cleanComponent = {
                        ...cleanComponent,
                        width: lineComp.width || 100,
                        height: lineComp.height || 2,
                        strokeColor: lineComp.strokeColor || '#000000',
                        strokeWidth: lineComp.strokeWidth || 1,
                    };
                    break;

                case 'image':
                    const imageComp = comp as Image;
                    cleanComponent = {
                        ...cleanComponent,
                        width: imageComp.width || 200,
                        height: imageComp.height || 200,
                        src: imageComp.src || '/api/placeholder/200/200',
                        alt: imageComp.alt || 'Image'
                    };
                    break;
            }

            // Log each cleaned component for debugging
            console.log(`Cleaned ${comp.type} component:`, cleanComponent);

            return cleanComponent;
        });

        const template = {
            type: "PDF",
            format: "A4",
            name: templateName,
            components: cleanComponents
        };

        // Log the final template
        console.log('Saving template:', JSON.stringify(template, null, 2));

        try {
            localStorage.setItem(`pdf-template-${templateName}`, JSON.stringify(template));
            console.log('Template saved to localStorage');
        } catch (error) {
            console.error('Error saving template:', error);
        }

        setShowNameInput(false);
        setIsSettingsOpen(false);
        setTemplateName('');
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, type: ComponentType) => {
        e.dataTransfer.setData('text/plain', type);
    };

    const hasStyle = (styleName: string): boolean => {
        if (!selectedComponent?.style) return false;
        switch (styleName) {
            case 'fontWeight':
                return selectedComponent.style.fontWeight === 'bold';
            case 'fontStyle':
                return selectedComponent.style.fontStyle === 'italic';
            case 'textDecoration':
                return selectedComponent.style.textDecoration === 'underline';
            default:
                return false;
        }
    };

    return (
        <div className="h-16 bg-white border-b border-gray-200 flex items-center px-4 gap-2">
            {/* Undo/Redo Controls */}
            <div className="flex items-center gap-2 border-r border-gray-200 pr-4">
                <button
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={onUndo}
                    title="Undo"
                >
                    <Undo2 className="w-5 h-5 text-gray-600" />
                </button>
                <button
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={onRedo}
                    title="Redo"
                >
                    <Redo2 className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            {/* Component Tools */}
            <div className="flex items-center gap-2 border-r border-gray-200 pr-4">
                <div
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-move"
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'text')}
                    title="Add Text"
                >
                    <Type className="w-5 h-5 text-gray-600" />
                </div>
                <div
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-move"
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'rectangle')}
                    title="Add Rectangle"
                >
                    <Square className="w-5 h-5 text-gray-600" />
                </div>
                <div
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-move"
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'circle')}
                    title="Add Circle"
                >
                    <Circle className="w-5 h-5 text-gray-600" />
                </div>
                <div
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-move"
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'image')}
                    title="Add Image"
                >
                    <ImageIcon className="w-5 h-5 text-gray-600" />
                </div>
            </div>

            {/* Text Formatting Tools - Only shown when text is selected */}
            {selectedComponent?.type === 'text' && (
                <div className="flex items-center gap-2 border-r border-gray-200 pr-4">
                    <button
                        className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
                            hasStyle('fontWeight') ? 'bg-gray-100' : ''
                        }`}
                        onClick={() => onStyleChange({ fontWeight: hasStyle('fontWeight') ? 'normal' : 'bold' })}
                        title="Bold"
                    >
                        <Bold className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                        className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
                            hasStyle('fontStyle') ? 'bg-gray-100' : ''
                        }`}
                        onClick={() => onStyleChange({ fontStyle: hasStyle('fontStyle') ? 'normal' : 'italic' })}
                        title="Italic"
                    >
                        <Italic className="w-5 h-5 text-gray-600" />
                    </button>
                    <button
                        className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
                            hasStyle('textDecoration') ? 'bg-gray-100' : ''
                        }`}
                        onClick={() => onStyleChange({ textDecoration: hasStyle('textDecoration') ? 'none' : 'underline' })}
                        title="Underline"
                    >
                        <Underline className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            )}

            {/* Color Tools - Shown when any component is selected */}
            {selectedComponent && (
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Palette className="w-4 h-4 text-gray-500" />
                        <input
                            type="color"
                            className="w-8 h-8 cursor-pointer"
                            value={selectedComponent.style?.fill || '#000000'}
                            onChange={(e) => onStyleChange({ fill: e.target.value })}
                            title="Fill Color"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Type className="w-4 h-4 text-gray-500" />
                        <input
                            type="color"
                            className="w-8 h-8 cursor-pointer"
                            value={selectedComponent.style?.color || '#000000'}
                            onChange={(e) => onStyleChange({ color: e.target.value })}
                            title="Text Color"
                        />
                    </div>
                </div>
            )}

            {/* Settings Dropdown */}
            <div className="ml-auto relative" ref={dropdownRef}>
                <button
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    title="Settings"
                >
                    <Settings className="w-5 h-5 text-gray-600" />
                    <ChevronDown className="w-4 h-4 text-gray-600" />
                </button>

                {isSettingsOpen && (
                    <div className="absolute right-0 top-12 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        {showNameInput ? (
                            <div className="px-4 py-2">
                                <input
                                    type="text"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter template name"
                                    value={templateName}
                                    onChange={(e) => setTemplateName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSaveTemplate();
                                        }
                                    }}
                                    autoFocus
                                />
                                <div className="flex justify-end mt-2 gap-2">
                                    <button
                                        className="px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded"
                                        onClick={() => {
                                            setShowNameInput(false);
                                            setTemplateName('');
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="px-3 py-1 text-sm bg-blue-500 text-white hover:bg-blue-600 rounded"
                                        onClick={handleSaveTemplate}
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center gap-2"
                                onClick={() => setShowNameInput(true)}
                            >
                                <Save className="w-4 h-4 text-gray-600" />
                                Save Template
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};