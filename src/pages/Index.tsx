import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

interface UCPackage {
  id: number;
  amount: number;
  price: number;
  bonus?: number;
  popular?: boolean;
}

interface Purchase {
  id: string;
  date: string;
  amount: number;
  price: number;
  playerId: string;
  paymentMethod: string;
  status: 'completed' | 'pending' | 'failed';
}

const ucPackages: UCPackage[] = [
  { id: 1, amount: 60, price: 60 },
  { id: 2, amount: 325, price: 300, bonus: 25 },
  { id: 3, amount: 660, price: 600, bonus: 60, popular: true },
  { id: 4, amount: 1800, price: 1500, bonus: 300 },
  { id: 5, amount: 3850, price: 3000, bonus: 850 },
  { id: 6, amount: 8100, price: 6000, bonus: 2100 },
];

const reviews = [
  { id: 1, name: 'Александр', rating: 5, text: 'Быстрая доставка UC, всё пришло за 2 минуты!' },
  { id: 2, name: 'Мария', rating: 5, text: 'Отличные цены и бонусы. Покупаю только здесь!' },
  { id: 3, name: 'Дмитрий', rating: 5, text: 'Надёжный магазин, оплата криптой прошла без проблем' },
];

export default function Index() {
  const [selectedPackage, setSelectedPackage] = useState<UCPackage | null>(null);
  const [playerId, setPlayerId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('sberbank');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [purchaseHistory, setPurchaseHistory] = useState<Purchase[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedHistory = localStorage.getItem('ucShopHistory');
    if (savedHistory) {
      setPurchaseHistory(JSON.parse(savedHistory));
    }
  }, []);

  const handleBuyClick = (pkg: UCPackage) => {
    setSelectedPackage(pkg);
    setIsDialogOpen(true);
  };

  const handlePurchase = () => {
    if (!playerId || playerId.length < 6) {
      toast({
        title: 'Ошибка',
        description: 'Введите корректный Player ID',
        variant: 'destructive',
      });
      return;
    }

    const paymentNames: { [key: string]: string } = {
      sberbank: 'Карта Сбербанк',
      card: 'Банковская карта',
      wallet: 'Электронный кошелек',
      crypto: 'Криптовалюта',
      donationalerts: 'DonationAlerts'
    };

    if (paymentMethod === 'donationalerts') {
      const donationUrl = `https://www.donationalerts.com/r/senza123?amount=${selectedPackage?.price}&message=UC%20${selectedPackage?.amount}%20-%20ID:%20${playerId}`;
      window.open(donationUrl, '_blank');
      
      const newPurchase: Purchase = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        amount: selectedPackage?.amount || 0,
        price: selectedPackage?.price || 0,
        playerId: playerId,
        paymentMethod: paymentNames[paymentMethod],
        status: 'pending'
      };

      const updatedHistory = [newPurchase, ...purchaseHistory];
      setPurchaseHistory(updatedHistory);
      localStorage.setItem('ucShopHistory', JSON.stringify(updatedHistory));

      toast({
        title: 'Переход к оплате! 💳',
        description: `Завершите оплату на DonationAlerts. UC придут после подтверждения.`,
      });
    } else {
      const newPurchase: Purchase = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        amount: selectedPackage?.amount || 0,
        price: selectedPackage?.price || 0,
        playerId: playerId,
        paymentMethod: paymentNames[paymentMethod],
        status: 'completed'
      };

      const updatedHistory = [newPurchase, ...purchaseHistory];
      setPurchaseHistory(updatedHistory);
      localStorage.setItem('ucShopHistory', JSON.stringify(updatedHistory));

      toast({
        title: 'Заказ оформлен! 🎮',
        description: `${selectedPackage?.amount} UC будут зачислены на ID: ${playerId}. Оплата: ${paymentNames[paymentMethod]}`,
      });
    }
    
    setIsDialogOpen(false);
    setPlayerId('');
    setPaymentMethod('sberbank');
    setSelectedPackage(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted">
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border">
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center animate-glow-pulse">
              <Icon name="Zap" className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              UC SHOP
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <a href="#catalog" className="text-foreground/80 hover:text-primary transition-colors">Каталог</a>
            <a href="#about" className="text-foreground/80 hover:text-primary transition-colors">О магазине</a>
            <a href="#reviews" className="text-foreground/80 hover:text-primary transition-colors">Отзывы</a>
            <a href="#help" className="text-foreground/80 hover:text-primary transition-colors">Помощь</a>
            <a href="#contacts" className="text-foreground/80 hover:text-primary transition-colors">Контакты</a>
            <Button 
              onClick={() => setIsHistoryOpen(true)}
              variant="outline"
              className="border-primary text-primary hover:bg-primary/10"
            >
              <Icon name="History" className="mr-2" size={18} />
              История
            </Button>
          </div>
          <Button variant="ghost" className="md:hidden">
            <Icon name="Menu" size={24} />
          </Button>
        </nav>
      </header>

      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20 animate-pulse" />
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{ backgroundImage: 'url(https://cdn.poehali.dev/projects/0468a234-6bd7-4757-9a1c-25f1962e8946/files/4f7a9aaf-4a95-429f-873f-8114430e4a10.jpg)' }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary animate-float">
              <Icon name="Sparkles" className="mr-1" size={14} />
              #1 Магазин UC в СНГ
            </Badge>
            <h1 className="text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent leading-tight">
              UC PUBG MOBILE
            </h1>
            <p className="text-xl md:text-2xl text-foreground/80 mb-8">
              Моментальная доставка • Бонусы на каждую покупку • Безопасные платежи
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg px-8">
                <Icon name="ShoppingBag" className="mr-2" size={20} />
                Купить UC
              </Button>
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10 text-lg px-8">
                <Icon name="Gift" className="mr-2" size={20} />
                Акции
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="catalog" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Каталог UC</h2>
            <p className="text-muted-foreground text-lg">Выбери свой пакет и получи бонусные UC</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {ucPackages.map((pkg) => (
              <Card 
                key={pkg.id}
                className={`relative overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  pkg.popular ? 'border-primary shadow-lg shadow-primary/50 animate-glow-pulse' : 'border-border'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge className="bg-gradient-to-r from-accent to-primary">
                      <Icon name="TrendingUp" className="mr-1" size={12} />
                      ХИТ
                    </Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 mx-auto mb-4 relative">
                    <img 
                      src="https://cdn.poehali.dev/projects/0468a234-6bd7-4757-9a1c-25f1962e8946/files/639e87e4-a48b-4bd1-b998-9890e1a29ee0.jpg"
                      alt="UC"
                      className="w-full h-full object-contain animate-float"
                    />
                  </div>
                  <CardTitle className="text-3xl font-black">
                    {pkg.amount} UC
                  </CardTitle>
                  {pkg.bonus && (
                    <CardDescription className="text-secondary font-semibold">
                      +{pkg.bonus} UC бонус
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-4">
                    <span className="text-4xl font-black text-primary">{pkg.price}₽</span>
                  </div>
                  <Dialog open={isDialogOpen && selectedPackage?.id === pkg.id} onOpenChange={(open) => {
                    if (!open) {
                      setIsDialogOpen(false);
                      setPlayerId('');
                      setPaymentMethod('sberbank');
                    }
                  }}>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90"
                        size="lg"
                        onClick={() => handleBuyClick(pkg)}
                      >
                        <Icon name="ShoppingCart" className="mr-2" size={18} />
                        Купить
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="text-2xl font-bold">
                          Покупка {pkg.amount} UC
                        </DialogTitle>
                        <DialogDescription>
                          Введите свой Player ID из PUBG Mobile
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="playerId">Player ID</Label>
                          <Input
                            id="playerId"
                            placeholder="Например: 5123456789"
                            value={playerId}
                            onChange={(e) => setPlayerId(e.target.value)}
                            className="text-lg"
                          />
                          <p className="text-sm text-muted-foreground">
                            Найти Player ID можно в настройках игры
                          </p>
                        </div>
                        <div className="space-y-3">
                          <Label>Способ оплаты</Label>
                          <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                            <div className="flex items-center space-x-3 border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                              <RadioGroupItem value="sberbank" id="sberbank" />
                              <Label htmlFor="sberbank" className="flex items-center gap-3 cursor-pointer flex-1">
                                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                                  <Icon name="CreditCard" className="text-white" size={20} />
                                </div>
                                <div className="flex-1">
                                  <div className="font-semibold">Карта Сбербанк</div>
                                  <div className="text-xs text-muted-foreground">Быстрая оплата</div>
                                </div>
                                <Badge className="bg-primary/20 text-primary">Популярно</Badge>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3 border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                              <RadioGroupItem value="card" id="card" />
                              <Label htmlFor="card" className="flex items-center gap-3 cursor-pointer flex-1">
                                <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                                  <Icon name="CreditCard" className="text-primary" size={20} />
                                </div>
                                <div className="flex-1">
                                  <div className="font-semibold">Банковская карта</div>
                                  <div className="text-xs text-muted-foreground">Visa, MasterCard, Мир</div>
                                </div>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3 border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                              <RadioGroupItem value="wallet" id="wallet" />
                              <Label htmlFor="wallet" className="flex items-center gap-3 cursor-pointer flex-1">
                                <div className="w-10 h-10 bg-secondary/20 rounded-lg flex items-center justify-center">
                                  <Icon name="Wallet" className="text-secondary" size={20} />
                                </div>
                                <div className="flex-1">
                                  <div className="font-semibold">Электронный кошелек</div>
                                  <div className="text-xs text-muted-foreground">ЮMoney, QIWI</div>
                                </div>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3 border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                              <RadioGroupItem value="crypto" id="crypto" />
                              <Label htmlFor="crypto" className="flex items-center gap-3 cursor-pointer flex-1">
                                <div className="w-10 h-10 bg-accent/20 rounded-lg flex items-center justify-center">
                                  <Icon name="Bitcoin" className="text-accent" size={20} />
                                </div>
                                <div className="flex-1">
                                  <div className="font-semibold">Криптовалюта</div>
                                  <div className="text-xs text-muted-foreground">BTC, ETH, USDT</div>
                                </div>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-3 border border-border rounded-lg p-3 hover:bg-muted/50 transition-colors cursor-pointer">
                              <RadioGroupItem value="donationalerts" id="donationalerts" />
                              <Label htmlFor="donationalerts" className="flex items-center gap-3 cursor-pointer flex-1">
                                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                                  <Icon name="Heart" className="text-orange-500" size={20} />
                                </div>
                                <div className="flex-1">
                                  <div className="font-semibold">DonationAlerts</div>
                                  <div className="text-xs text-muted-foreground">Быстрый платеж</div>
                                </div>
                                <Badge className="bg-orange-500/20 text-orange-500">Новое</Badge>
                              </Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Количество UC:</span>
                            <span className="font-bold text-primary">{pkg.amount} UC</span>
                          </div>
                          {pkg.bonus && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Бонус:</span>
                              <span className="font-bold text-secondary">+{pkg.bonus} UC</span>
                            </div>
                          )}
                          <div className="flex justify-between pt-2 border-t border-border">
                            <span className="font-semibold">Итого:</span>
                            <span className="text-2xl font-black text-primary">{pkg.price}₽</span>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={handlePurchase}
                        className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-lg py-6"
                        size="lg"
                      >
                        <Icon name="Zap" className="mr-2" size={20} />
                        Оплатить {pkg.price}₽
                      </Button>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">О магазине</h2>
            <p className="text-lg text-foreground/80 mb-8 leading-relaxed">
              UC SHOP — официальный партнёр PUBG Mobile в СНГ. Мы предлагаем самые выгодные цены 
              на внутриигровую валюту с моментальной доставкой. Более 50 000 довольных игроков 
              уже оценили наш сервис. Работаем 24/7, поддержка всегда на связи!
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12">
              <div className="text-center">
                <div className="text-4xl font-black text-primary mb-2">50K+</div>
                <div className="text-sm text-muted-foreground">Клиентов</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-secondary mb-2">2 мин</div>
                <div className="text-sm text-muted-foreground">Доставка</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-accent mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Поддержка</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-primary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Гарантия</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="payment" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Способы оплаты</h2>
            <p className="text-lg text-foreground/80 mb-12">Принимаем все популярные методы оплаты</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card className="p-6 hover:shadow-lg hover:border-primary transition-all">
                <Icon name="CreditCard" className="mx-auto mb-3 text-primary" size={40} />
                <p className="font-semibold">Банковские карты</p>
              </Card>
              <Card className="p-6 hover:shadow-lg hover:border-secondary transition-all">
                <Icon name="Wallet" className="mx-auto mb-3 text-secondary" size={40} />
                <p className="font-semibold">Электронные кошельки</p>
              </Card>
              <Card className="p-6 hover:shadow-lg hover:border-accent transition-all">
                <Icon name="Smartphone" className="mx-auto mb-3 text-accent" size={40} />
                <p className="font-semibold">Мобильные платежи</p>
              </Card>
              <Card className="p-6 hover:shadow-lg hover:border-primary transition-all">
                <Icon name="Bitcoin" className="mx-auto mb-3 text-primary" size={40} />
                <p className="font-semibold">Криптовалюта</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="reviews" className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">Отзывы игроков</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <Card key={review.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white font-bold">
                        {review.name[0]}
                      </div>
                      <div>
                        <CardTitle className="text-sm">{review.name}</CardTitle>
                        <div className="flex gap-1">
                          {Array.from({ length: review.rating }).map((_, i) => (
                            <Icon key={i} name="Star" size={14} className="text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-foreground/80">{review.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="help" className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center">Помощь</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left">Как быстро приходят UC?</AccordionTrigger>
                <AccordionContent>
                  UC зачисляются на ваш аккаунт автоматически в течение 2-5 минут после оплаты. В редких случаях может занять до 15 минут.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left">Какие данные нужны для покупки?</AccordionTrigger>
                <AccordionContent>
                  Для покупки UC нужен только ваш Player ID из PUBG Mobile. Никакие пароли и личные данные не требуются.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left">Безопасна ли оплата криптовалютой?</AccordionTrigger>
                <AccordionContent>
                  Да, мы используем проверенные криптовалютные процессоры с многоуровневой защитой. Все транзакции зашифрованы.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left">Что делать если UC не пришли?</AccordionTrigger>
                <AccordionContent>
                  Свяжитесь с нашей поддержкой 24/7 через Telegram или WhatsApp. Мы решим любую проблему в течение часа.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left">Можно ли вернуть деньги?</AccordionTrigger>
                <AccordionContent>
                  Возврат возможен только если UC не были зачислены на аккаунт по нашей вине. После зачисления UC возврат не производится.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      <section id="contacts" className="py-16 md:py-24 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Контакты</h2>
            <p className="text-lg text-foreground/80 mb-12">Мы всегда на связи!</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-8 hover:shadow-lg hover:border-primary transition-all">
                <Icon name="Send" className="mx-auto mb-4 text-primary" size={40} />
                <h3 className="font-bold mb-2">Telegram</h3>
                <p className="text-sm text-muted-foreground">@ucshop_support</p>
              </Card>
              <Card className="p-8 hover:shadow-lg hover:border-secondary transition-all">
                <Icon name="MessageCircle" className="mx-auto mb-4 text-secondary" size={40} />
                <h3 className="font-bold mb-2">WhatsApp</h3>
                <p className="text-sm text-muted-foreground">+7 900 123-45-67</p>
              </Card>
              <Card className="p-8 hover:shadow-lg hover:border-accent transition-all">
                <Icon name="Mail" className="mx-auto mb-4 text-accent" size={40} />
                <h3 className="font-bold mb-2">Email</h3>
                <p className="text-sm text-muted-foreground">support@ucshop.ru</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <Icon name="Zap" className="text-white" size={18} />
              </div>
              <span className="font-bold text-lg">UC SHOP</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2024 UC SHOP. Все права защищены.</p>
            <div className="flex gap-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Icon name="Instagram" size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Icon name="Youtube" size={20} />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Icon name="Send" size={20} />
              </a>
            </div>
          </div>
        </div>
      </footer>

      <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold flex items-center gap-2">
              <Icon name="History" className="text-primary" size={28} />
              История покупок
            </DialogTitle>
            <DialogDescription>
              Все ваши покупки UC сохранены в браузере
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {purchaseHistory.length === 0 ? (
              <div className="text-center py-12">
                <Icon name="ShoppingBag" className="mx-auto mb-4 text-muted-foreground" size={48} />
                <p className="text-muted-foreground text-lg">Пока нет покупок</p>
                <p className="text-sm text-muted-foreground mt-2">Оформите первый заказ!</p>
              </div>
            ) : (
              purchaseHistory.map((purchase) => (
                <Card key={purchase.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                          <Icon name="Zap" className="text-white" size={24} />
                        </div>
                        <div>
                          <div className="font-bold text-lg">{purchase.amount} UC</div>
                          <div className="text-sm text-muted-foreground">
                            Player ID: {purchase.playerId}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {new Date(purchase.date).toLocaleDateString('ru-RU', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-primary">{purchase.price}₽</div>
                        <div className="text-xs text-muted-foreground mt-1">{purchase.paymentMethod}</div>
                        <Badge className={`mt-2 ${
                          purchase.status === 'completed' 
                            ? 'bg-green-500/20 text-green-500 border-green-500' 
                            : purchase.status === 'pending'
                            ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500'
                            : 'bg-red-500/20 text-red-500 border-red-500'
                        }`}>
                          {purchase.status === 'completed' ? 'Завершено' : purchase.status === 'pending' ? 'В обработке' : 'Отменено'}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          {purchaseHistory.length > 0 && (
            <div className="border-t border-border pt-4">
              <div className="flex justify-between items-center">
                <div className="text-sm text-muted-foreground">
                  Всего покупок: {purchaseHistory.length}
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Общая сумма</div>
                  <div className="text-2xl font-black text-primary">
                    {purchaseHistory.reduce((sum, p) => sum + p.price, 0)}₽
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}