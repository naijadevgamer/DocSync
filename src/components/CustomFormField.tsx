import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Control,
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
} from "react-hook-form";
import { IoIosLock } from "react-icons/io";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { Checkbox } from "./ui/checkbox";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectTrigger, SelectValue } from "./ui/select";
import { Textarea } from "./ui/textarea";

// import { E164Number } from "libphonenumber-js/core";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneInput",
  PASSWORD_INPUT = "passwordInput",
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
  icon?: React.ReactNode;
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
  const [showPassword, setShowPassword] = useState(false);

  switch (props.fieldType) {
    case FormFieldType.INPUT:
      return (
        <div className="border-dark-500 bg-dark-400 flex rounded-md border">
          {props.icon && (
            <div className="ml-2 flex items-center justify-center text-[#CDE9DF]">
              {props.icon}
            </div>
          )}

          <Input
            {...field}
            id={field.name}
            placeholder={props.placeholder}
            aria-invalid={fieldState.invalid}
            className="shad-input border-0"
            autoComplete="off"
            disabled={props.disabled}
          />
        </div>
      );

    case FormFieldType.PASSWORD_INPUT:
      return (
        <div className="border-dark-500 bg-dark-400 flex items-center rounded-md border">
          <div className="ml-2 flex items-center justify-center text-[#CDE9DF]">
            <IoIosLock size={22} className="" />
          </div>

          <Input
            {...field}
            id={field.name}
            placeholder={props.placeholder}
            aria-invalid={fieldState.invalid}
            className="shad-input flex-1 border-0"
            autoComplete="off"
            type={showPassword ? "text" : "password"} // ✅ toggle
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="mr-3 flex items-center"
          >
            {!showPassword ? (
              <IoEyeOffOutline size={22} className="text-[#CDE9DF]" />
            ) : (
              <IoEyeOutline size={22} className="text-[#CDE9DF]" />
            )}
          </button>
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
          {props.icon && (
            <div className="ml-2 flex items-center justify-center text-[#CDE9DF]">
              {props.icon}
            </div>
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
  const { control, name, label, disabled } = props;

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
