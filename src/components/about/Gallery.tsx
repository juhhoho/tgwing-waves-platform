
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Gallery = () => {
  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6 text-white">활동 갤러리</h2>
      <Carousel className="w-full max-w-4xl mx-auto">
        <CarouselContent>
          {[1, 2, 3].map((idx) => (
            <CarouselItem key={idx}>
              <Card className="bg-white/10 backdrop-blur-md">
                <CardContent className="p-0">
                  <img
                    src={`https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800`}
                    alt={`Activity ${idx}`}
                    className="w-full h-64 object-cover rounded-lg"
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
