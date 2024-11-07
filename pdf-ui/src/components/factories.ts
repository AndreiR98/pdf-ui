import {PDFComponent, ComponentType} from "@/types/types";

export const createComponent = (
    type: ComponentType,
    x: number,
    y: number
): PDFComponent => {
    const baseProps = {
        id: `${type}-${Date.now()}`,
        x,
        y,
    };

    switch (type) {
        case 'text':
            return {
                ...baseProps,
                type: 'text',
                content: 'New text',
                style: {
                    fontWeight: 'normal',
                    fontStyle: 'normal',
                    textDecoration: 'none',
                }
            };

        case 'rectangle':
            return {
                ...baseProps,
                type: 'rectangle',
                width: 100,
                height: 100,
                strokeColor: '#000000',
                fillColor: 'transparent',
            };

        case 'circle':
            return {
                ...baseProps,
                type: 'circle',
                radius: 50,
                strokeColor: '#000000',
                fillColor: 'transparent',
            };

        case 'line':
            return {
                ...baseProps,
                type: 'line',
                width: 100,
                height: 2,
                strokeColor: '#000000',
                fillColor: 'transparent',
            };

        case 'image':
            return {
                ...baseProps,
                type: 'image',
                width: 200,
                height: 200,
                src: '/api/placeholder/200/200',
            };

        default:
            throw new Error(`Unsupported component type: ${type}`);
    }
};