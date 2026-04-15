import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const testimonials = [
  {
    name: 'El Haggai',
    avatar: 'EH',
    review: 'First class suits, trousers and accessories are here. As long as you have what it takes you are all good to go. The suits here are really well chosen and quality. The ties are second to none.',
    rating: 5,
  },
  {
    name: 'Edeh Frank',
    avatar: 'EF',
    review: 'A good place to have any kind of male clothing you need. They have a new outlet at 139 Aka Etinan Road.',
    rating: 5,
  },
  {
    name: 'John Milton',
    avatar: 'JM',
    review: 'It\'s a good place for buying men\'s wares in Uyo with a moderate price list especially for bulk purchases.',
    rating: 4,
  },
  {
    name: 'Mboso Andem',
    avatar: 'MA',
    review: 'Nice place with excellent customer service. Prices are negotiable in a friendly manner.',
    rating: 5,
  },
  {
    name: 'Gregory Uduk',
    avatar: 'GU',
    review: 'Gifto Boutique is a wonderful place to be, with nice outfits. I love Gifto!',
    rating: 5,
  },
  {
    name: 'Frederick Akpaidem',
    avatar: 'FA',
    review: 'Nice place to shop. Great selection of quality men\'s clothing and accessories.',
    rating: 4,
  },
  {
    name: 'Iranyang Ezekiel',
    avatar: 'IE',
    review: 'Home of good quality wears. Tested and trusted.',
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">What Our Customers Say</h2>
          <p className="text-muted-foreground mt-2">Real stories from our amazing community.</p>
        </div>
        <div className="relative">
          <ScrollArea className="w-full whitespace-nowrap rounded-md">
            <div className="flex w-max space-x-6 pb-4">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="w-[300px] sm:w-[350px] whitespace-normal">
                   <Card className="bg-secondary/30 border-none shadow-sm h-full">
                    <CardContent className="p-6 flex flex-col items-center text-center h-full">
                      <div className="flex mb-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-500 fill-yellow-400' : 'text-muted-foreground/30'}`}
                          />
                        ))}
                      </div>
                      <p className="text-muted-foreground mb-6 flex-grow">&quot;{testimonial.review}&quot;</p>
                      <div className="flex items-center gap-4 mt-auto">
                          {/* <Avatar>
                              <AvatarImage src={`https://placehold.co/40x40.png`} alt={testimonial.name} />
                              <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                          </Avatar> */}
                          <p className="font-semibold">{testimonial.name}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
    </section>
  );
}
