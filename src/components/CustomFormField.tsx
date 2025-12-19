import Image from "next/image";
import {
  Control,
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
} from "react-hook-form";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "./ui/input";
import PhoneInput from "react-phone-number-input";

// import PhoneInput from "react-phone-number-input/react-native-input";
// import { E164Number } from "libphonenumber-js/core";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SELECT = "select",
  SKELETON = "skeleton",
}

interface CustomProps {
  control: Control<any>;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  // disabled?: boolean;
  // dateFormat?: string;
  // showTimeSelect?: boolean;
  // children?: React.ReactNode;
  // renderSkeleton?: (field: any) => React.ReactNode;
  fieldType: FormFieldType;
}

const RenderInput = ({
  field,
  fieldState,
  props,
}: {
  field: ControllerRenderProps<any, string>;
  fieldState: ControllerFieldState;
  props: CustomProps;
}) => {
  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="border-dark-500 bg-dark-400 flex rounded-md border">
          {props.iconSrc && (
            <Image
              src={props.iconSrc}
              height={24}
              width={24}
              alt={props.iconAlt || "icon"}
              className="ml-2"
            />
          )}

          <Input
            {...field}
            id={field.name}
            placeholder={props.placeholder}
            aria-invalid={fieldState.invalid}
            className="shad-input border-0"
            autoComplete="off"
          />
        </div>
      );
    case FormFieldType.TEXTAREA:
      return <div>Textarea</div>;
    case FormFieldType.PHONE_INPUT:
      return (
        <PhoneInput
          defaultCountry="US"
          placeholder={props.placeholder}
          international
          withCountryCallingCode
          value={field.value}
          onChange={field.onChange}
          className="input-phone"
        />
      );
    case FormFieldType.CHECKBOX:
      return <div>Checkbox</div>;
    case FormFieldType.DATE_PICKER:
      return <div>Date Picker</div>;
    case FormFieldType.SELECT:
      return <div>Select</div>;
    case FormFieldType.SKELETON:
      return <div>Skeleton</div>;
    default:
      return null;
  }
};

export default function CustomFormField(props: CustomProps) {
  const { control, name, label } = props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          {props.fieldType !== FormFieldType.CHECKBOX && label && (
            <FieldLabel htmlFor={field.name} className="shad-input-label">
              {label}
            </FieldLabel>
          )}

          <RenderInput field={field} fieldState={fieldState} props={props} />

          {fieldState.invalid && (
            <FieldError errors={[fieldState.error]} className="shad-error" />
          )}
        </Field>
      )}
    />
  );
}
