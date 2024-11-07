"use client"

import React, { useState, useCallback } from 'react';
import { Toolbar } from '@/components/Toolbar';
import { Canvas } from '@/components/Canvas';
import { createComponent } from '@/utils/componentFactory';
import { ComponentType, PDFComponent } from '@/types/types';

const PDFCreator: React.FC = () => {
    const [components, setComponents] = useState<PDFComponent[]>([]);
    const [selectedComponent, setSelectedComponent] = useState<PDFComponent | null>(null);

    const handleDrop = useCallback((x: number, y: number, type: string) => {
        try {
            const newComponent = createComponent(type as ComponentType, x, y);
            console.log('Created new component:', newComponent); // Debug log
            setComponents(prev => {
                const updated = [...prev, newComponent];
                console.log('Updated components:', updated); // Debug log
                return updated;
            });
        } catch (error) {
            console.error('Failed to create component:', error);
        }
    }, []);

    const handleUpdateComponent = useCallback((id: string, updates: Partial<PDFComponent>) => {
        setComponents(prevComponents =>
            prevComponents.map(component =>
                component.id === id
                    ? { ...component, ...updates }
                    : component
            )
        );
    }, []);

    const handleStyleChange = useCallback((styleUpdate: React.CSSProperties) => {
        if (selectedComponent) {
            handleUpdateComponent(selectedComponent.id, {
                style: { ...selectedComponent.style, ...styleUpdate }
            });
        }
    }, [selectedComponent, handleUpdateComponent]);

    const handleAddComponent = useCallback((type: ComponentType) => {
        // Default position in the center of the canvas
        const newComponent = createComponent(type, 200, 200);
        setComponents(prev => [...prev, newComponent]);
        setSelectedComponent(newComponent);
    }, []);

    return (
        <div className="flex h-screen">
            <div className="flex-1 flex flex-col">
                <Toolbar
                    onUndo={() => {}}
                    onRedo={() => {}}
                    selectedComponent={selectedComponent}
                    onStyleChange={handleStyleChange}
                    onAddComponent={handleAddComponent}
                    components={components}
                />
                <Canvas
                    components={components}
                    selectedComponent={selectedComponent}
                    onSelectComponent={setSelectedComponent}
                    onUpdateComponent={handleUpdateComponent}
                    onDrop={handleDrop}
                />
            </div>
        </div>
    );
};

export default PDFCreator;