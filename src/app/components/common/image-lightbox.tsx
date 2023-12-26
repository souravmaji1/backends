import React from 'react';
import Lightbox from 'react-18-image-lightbox';

// prop type
type IProps = {
    images:string[];
    open:boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    photoIndex: number;
    setPhotoIndex: React.Dispatch<number>;
}

const ImageLightBox = ({images,open,setOpen,photoIndex,setPhotoIndex}:IProps) => {
    return (
        <>
            {open && (
                <Lightbox
                    mainSrc={images[photoIndex]}
                    nextSrc={images[(photoIndex + 1) % images.length]}
                    prevSrc={images[(photoIndex + images.length - 1) % images.length]}
                    onCloseRequest={() => setOpen(false)}
                    onMovePrevRequest={() => setPhotoIndex((photoIndex + images.length - 1) % images.length)}
                    onMoveNextRequest={() => setPhotoIndex((photoIndex + 1) % images.length)}
                />
            )}
        </>
    )
}

export default ImageLightBox;