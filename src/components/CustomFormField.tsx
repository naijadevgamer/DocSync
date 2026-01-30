import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import Image from "next/image";
import {
  Control,
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
} from "react-hook-form";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Input } from "./ui/input";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";

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
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: React.ReactNode;
  renderSkeleton?: (field: any) => React.ReactNode;
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
      return (
        <Textarea
          placeholder={props.placeholder}
          {...field}
          className="shad-textArea"
          disabled={props.disabled}
        />
      );
    case FormFieldType.PHONE_INPUT:
      return (
        <PhoneInput
          defaultCountry="NG"
          placeholder={props.placeholder}
          international
          withCountryCallingCode
          value={field.value}
          onChange={field.onChange}
          className="input-phone"
        />
      );
    case FormFieldType.CHECKBOX:
      return (
        <div className="flex items-center gap-4">
          <Checkbox
            id={props.name}
            checked={field.value}
            onCheckedChange={field.onChange}
          />
          <FieldLabel htmlFor={props.name} className="shad-input-label">
            {props.label}
          </FieldLabel>
        </div>
      );
    case FormFieldType.DATE_PICKER:
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
          <ReactDatePicker
            showTimeSelect={props.showTimeSelect ?? false}
            selected={field.value}
            placeholderText={props.placeholder}
            onChange={(date: any) => field.onChange(date)}
            timeInputLabel="Time:"
            dateFormat={props.dateFormat ?? "MM/dd/yyyy"}
            wrapperClassName="date-picker "
            className="shad-input"
          />
        </div>
      );
    case FormFieldType.SELECT:
      return (
        <Select onValueChange={field.onChange} defaultValue={field.value}>
          <SelectTrigger className="shad-select-trigger">
            <SelectValue
              placeholder={props.placeholder}
              className="placeholder:text-dark-600!"
            />
          </SelectTrigger>
          <SelectContent className="shad-select-content">
            {props.children}
          </SelectContent>
        </Select>
      );
    case FormFieldType.SKELETON:
      return props.renderSkeleton ? props.renderSkeleton(field) : null;
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
