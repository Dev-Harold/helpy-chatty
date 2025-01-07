'use client'

interface ReviewProps {
    image?: string;  
    message?: string;
    author?: string;
}

export default function Review({ image = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png", message = "Good Site", author = "Harold Richards" }: ReviewProps) { 
    return (
        <div className="max-w-7xl mx-auto">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900">{author}</h1>
                <div className="container max-w-7xl mx-auto">
                    <img src={image} alt="Image of the reviewer" className="review-image"/>
                    <p className="text-2xl font-bold text-gray-900">{message}</p>
                </div>
            </div>
        </div>
    )
}
