
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Gallery = () => {

  const imageUrls = [
    "https://demo-bucket-605134439665.s3.ap-northeast-2.amazonaws.com/liz.png",
    "https://demo-bucket-605134439665.s3.ap-northeast-2.amazonaws.com/wonyoung.png",
    "https://demo-bucket-605134439665.s3.ap-northeast-2.amazonaws.com/leeseo.png"
  ];

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-white">활동 갤러리</h2>
      <Carousel className="w-full max-w-4xl mx-auto">
      <CarouselContent>
        {imageUrls.map((url, idx) => (
          <CarouselItem key={idx}>
            <Card className="bg-white/10 backdrop-blur-md">
              <CardContent className="p-0">
                <img
                  src={url}
                  alt={`Activity ${idx}`}
                  className="w-full aspect-[16/9] object-cover rounded-lg "
                />
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};

export default Gallery;
