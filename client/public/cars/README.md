# Car Images Structure

This directory contains car images organized by car ID. Each car has its own folder with multiple images.

## Folder Structure:
```
client/public/cars/
├── car-1/
│   ├── main.jpg
│   ├── side.jpg
│   ├── interior.jpg
│   └── back.jpg
├── car-2/
│   ├── main.jpg
│   ├── side.jpg
│   └── interior.jpg
└── ...
```

## Image Requirements:
- Format: JPG or PNG
- Recommended size: 800x600 pixels
- Maximum file size: 2MB per image
- At least 1 image per car (main.jpg)

## Naming Convention:
- main.jpg - Main front view (required)
- side.jpg - Side view
- interior.jpg - Interior view
- back.jpg - Back view
- engine.jpg - Engine view
- Additional images can be named: image1.jpg, image2.jpg, etc.

## Usage:
Images are automatically loaded based on car ID. The system looks for images in the format:
`/cars/car-{id}/{imagename}.jpg`