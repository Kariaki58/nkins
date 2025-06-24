import { Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const testimonials = [
  {
    name: 'Aisha Bello',
    avatar: 'AB',
    review: 'The quality of the Scarlet Elegance dress is breathtaking. I felt like a queen at the wedding I attended. So many compliments!',
    rating: 5,
  },
  {
    name: 'Chioma Okoro',
    avatar: 'CO',
    review: 'My Onyx Power Jumpsuit is my new favorite outfit. It\'s so comfortable yet incredibly chic. I wear it for work and for evenings out.',
    rating: 5,
  },
  {
    name: 'Fatima Sanusi',
    avatar: 'FS',
    review: 'I was hesitant to buy online, but I\'m so glad I did. The fit is perfect, and the fabric feels amazing. Nkins has a new loyal customer!',
    rating: 4,
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-secondary/30 border-none shadow-sm">
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
                    <Avatar>
                        <AvatarImage src={`https://placehold.co/40x40.png`} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.avatar}</AvatarFallback>
                    </Avatar>
                    <p className="font-semibold">{testimonial.name}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
