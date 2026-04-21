"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { PersonalData } from "@/hooks/useProviderOnboarding";

const schema = z.object({
  displayName: z.string().min(2, "Mínimo 2 caracteres").max(100),
  headline: z.string().max(150, "Máximo 150 caracteres").optional().or(z.literal("")),
  phone: z.string().min(8, "Mínimo 8 dígitos").max(20).optional().or(z.literal("")),
  taxId: z.string().max(13).optional().or(z.literal("")),
  yearsOfExperience: z.number().min(0).max(70).optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  data: PersonalData;
  onNext: (data: PersonalData) => void;
}

export function PersonalDataStep({ data, onNext }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      displayName: data.displayName,
      headline: data.headline,
      phone: data.phone,
      taxId: data.taxId,
      yearsOfExperience: data.yearsOfExperience || undefined,
    },
  });

  const onSubmit = (values: FormValues) => {
    onNext({
      displayName: values.displayName,
      headline: values.headline ?? "",
      phone: values.phone ?? "",
      taxId: values.taxId ?? "",
      yearsOfExperience: values.yearsOfExperience ?? 0,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-1">
          Datos personales
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Contanos sobre vos para que los clientes te conozcan
        </p>
      </div>

      <div className="space-y-4">
        <Input
          label="Nombre profesional *"
          placeholder="Ej: Juan Pérez Electricista"
          error={errors.displayName?.message}
          {...register("displayName")}
        />

        <Input
          label="Título o especialidad"
          placeholder="Ej: Electricista matriculado con 10 años de experiencia"
          error={errors.headline?.message}
          {...register("headline")}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Teléfono"
            placeholder="Ej: 11 2345-6789"
            error={errors.phone?.message}
            {...register("phone")}
          />
          <Input
            label="CUIT/CUIL"
            placeholder="Ej: 20-12345678-9"
            error={errors.taxId?.message}
            {...register("taxId")}
          />
        </div>

        <Input
          label="Años de experiencia"
          type="number"
          placeholder="Ej: 5"
          error={errors.yearsOfExperience?.message}
          {...register("yearsOfExperience")}
        />
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" className="px-8">
          Siguiente
        </Button>
      </div>
    </form>
  );
}
