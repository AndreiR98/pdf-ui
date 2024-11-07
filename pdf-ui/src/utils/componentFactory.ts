import { ComponentType, PDFComponent, TextArea, Shape, Image } from '@/types/types';

export const createComponent = (type: ComponentType, x: number, y: number): PDFComponent => {
    const baseComponent = {
        id: `${type}-${Date.now()}`,
        x,
        y,
    };

    switch (type) {
        case 'text':
            return {
                ...baseComponent,
                type: 'text',
                content: 'New text',
                width: 200,
                height: 100,
                style: {
                    fontFamily: 'Arial',
                    fontSize: '16px',
                    fontWeight: 'normal',
                    fontStyle: 'normal',
                    textDecoration: 'none',
                    color: '#000000',
                    fill: 'transparent'
                }
            } as TextArea;

        case 'rectangle':
            return {
                ...baseComponent,
                type: 'rectangle',
                width: 100,
                height: 100,
                strokeColor: '#000000',
                strokeWidth: 1,
                fillColor: 'transparent',
                style: {
                    fill: 'transparent',
                    stroke: '#000000'
                }
            } as Shape;

        case 'circle':
            return {
                ...baseComponent,
                type: 'circle',
                width: 100,
                height: 100,
                radius: 50,
                strokeColor: '#000000',
                strokeWidth: 1,
                fillColor: 'transparent',
                style: {
                    fill: 'transparent',
                    stroke: '#000000'
                }
            } as Shape;

        case 'line':
            return {
                ...baseComponent,
                type: 'line',
                width: 100,
                height: 2,
                strokeColor: '#000000',
                strokeWidth: 2,
                fillColor: 'transparent',
                style: {
                    stroke: '#000000'
                }
            } as Shape;

        case 'image':
            return {
                ...baseComponent,
                type: 'image',
                width: 200,
                height: 200,
                src: '/api/placeholder/200/200',
                alt: 'New image',
                style: {
                    objectFit: 'contain'
                }
            } as Image;

        default:
            throw new Error(`Unsupported component type: ${type}`);
    }
};