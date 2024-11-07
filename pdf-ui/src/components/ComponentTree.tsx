import React from 'react';
import { ChevronRight } from 'lucide-react';
import {PDFComponent} from "@/types/types";

interface ComponentTreeProps {
    components: PDFComponent[];
    selectedComponent: PDFComponent | null;
    onSelectComponent: (component: PDFComponent) => void;
}

export const ComponentTree: React.FC<ComponentTreeProps> = ({
                                                                components,
                                                                selectedComponent,
                                                                onSelectComponent
                                                            }) => {
    const getComponentIcon = (type: string) => {
        switch (type) {
            case 'text': return '📝';
            case 'image': return '🖼️';
            case 'rectangle': return '⬜';
            case 'circle': return '⭕';
            case 'line': return '➖';
            default: return '📄';
        }
    };

    return (
        <div className="w-64 bg-white border-l p-4 overflow-y-auto">
            <h3 className="font-semibold mb-4">Components Tree</h3>
            <div className="space-y-2">
                {components.map((component) => (
                    <div
                        key={component.id}
                        className={`flex items-center space-x-2 p-2 rounded ${
                            selectedComponent?.id === component.id ? 'bg-blue-100' : 'hover:bg-gray-100'
                        } cursor-pointer`}
                        onClick={() => onSelectComponent(component)}
                    >
                        <ChevronRight className="w-4 h-4" />
                        <span>{getComponentIcon(component.type)}</span>
                        <div className="flex-1">
                            <div className="text-sm font-medium">
                                {component.type.charAt(0).toUpperCase() + component.type.slice(1)}
                            </div>
                            <div className="text-xs text-gray-500">
                                x: {Math.round(component.x)}, y: {Math.round(component.y)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};