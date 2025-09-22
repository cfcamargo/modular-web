import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  CalendarIcon,
  Check,
  ChevronDownIcon,
  ChevronsUpDown,
  User,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Customer, Quote } from "@/models/common/quotes";
import { mockCustomers } from "../mock-data";
import { DateField, DateInput } from "@/components/ui/datefield-rac";

interface QuoteInfoProps {
  quote: Quote;
  onUpdate: (quote: Quote) => void;
}

export const QuoteInfo = ({ quote, onUpdate }: QuoteInfoProps) => {
  const [customerOpen, setCustomerOpen] = useState(false);

  const handleCustomerSelect = (customer: Customer) => {
    onUpdate({ ...quote, customer });
    setCustomerOpen(false);
  };

  const handleDateSelect = (date: Date | undefined) => {
    onUpdate({ ...quote, validUntil: date || null });
  };

  const handleNotesChange = (notes: string) => {
    onUpdate({ ...quote, notes });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Dados do Orçamento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="customer">Cliente</Label>
        </div>

        <div className="w-ful flex flex-col gap-3">
          <DateField className="*:not-first:mt-2">
            <Label className="text-foreground text-sm font-medium">
              Validade
            </Label>
            <DateInput className="bg-transparent" />
          </DateField>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes">Observações</Label>
          <Textarea
            id="notes"
            placeholder="Adicione observações sobre o orçamento..."
            value={quote.notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
      </CardContent>
    </Card>
  );
};
