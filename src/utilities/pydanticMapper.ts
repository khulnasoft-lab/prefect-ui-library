
import { PTextInput, PToggle, PTextarea, PDateInput, PNumberInput, PCombobox } from '@prefecthq/prefect-design'
import JsonEditor from '@/components/JsonEditor.vue'
import { ValidateMethod, isEmail, greaterThanOrEqual, greaterThan, lessThan, lessThanOrEqual } from '@/services'
import {
  PydanticType,
  PydanticEnum,
  PydanticStringFormat,
  TypeDefinition,
  hasMinLength,
  hasMaxLength,
  hasMin,
  hasExclusiveMin,
  hasMax,
  hasExclusiveMax,
  hasMinItems,
  hasMaxItems,
  hasMultipleOf,
  isPydanticEnum,
  isPydanticType,
  isPydanticStringFormat
} from '@/types/Pydantic'

const InputComponents = [PToggle, PTextInput, PTextarea, JsonEditor, PDateInput, PNumberInput, PCombobox] as const

export type TypeDefinitionComponentAttrs = Record<string, unknown>
export type TypeDefinitionComponent = {
  attrs: TypeDefinitionComponentAttrs,
  component?: typeof InputComponents[number],
  defaultValue: unknown,
  validators: ValidateMethod[],
}

interface BaseJsonInput extends TypeDefinitionComponent {
  component: typeof JsonEditor,
  defaultValue: string,
}

interface BaseTextInput extends TypeDefinitionComponent {
  attrs: {
    type: 'text',
  },
  component: typeof PTextInput,
  defaultValue: string,
}

interface BaseToggleInput extends TypeDefinitionComponent {
  component: typeof PToggle,
  defaultValue: boolean,
}

interface BaseNumberInput extends TypeDefinitionComponent {
  attrs: {
    min?: number | string,
    max?: number | string,
    step?: number | string,
  },
  component: typeof PNumberInput,
  defaultValue: number,
}

interface BaseEnumInput extends TypeDefinitionComponent {
  attrs: {
    allowUnknownValue: boolean,
    multiple: boolean,
    options: PydanticEnum<unknown>,
  },
  component: typeof PCombobox,
  defaultValue: unknown[],
}

interface BaseDateInput extends TypeDefinitionComponent {
  attrs: {
    showTime: boolean,
  },
  component: typeof PDateInput,
  defaultValue: Date,
}

const baseJsonInput: BaseJsonInput = {
  attrs: {},
  component: JsonEditor,
  defaultValue: '',
  validators: [],
}

const baseTextInput: BaseTextInput = {
  attrs: {
    type: 'text',
  },
  defaultValue: '',
  component: PTextInput,
  validators: [],
}

const baseToggleInput: BaseToggleInput = {
  attrs: {},
  component: PToggle,
  defaultValue: false,
  validators: [],
}

const baseNumberInput: BaseNumberInput = {
  attrs: {},
  component: PNumberInput,
  defaultValue: 0,
  validators: [],
}

const baseEnumInput: BaseEnumInput = {
  attrs: {
    allowUnknownValue: false,
    multiple: false,
    options: [] as PydanticEnum<unknown>,
  },
  component: PCombobox,
  defaultValue: [],
  validators: [],
}

const baseDateInput: BaseDateInput = {
  attrs: {
    showTime: false,
  },
  component: PDateInput,
  defaultValue: new Date(),
  validators: [],
}

const StringFormatComponentMap: Record<PydanticStringFormat, TypeDefinitionComponent> = {
  'date': baseDateInput,
  'date-time': {
    ...baseDateInput,
    attrs: {
      showTime: true,
    },
  },
  'regex': baseTextInput,
  'email': {
    ...baseTextInput,
    validators: [isEmail],
  },
  'json-string': baseJsonInput,
  'time-delta': baseNumberInput,
}

const getValidators = (definition: TypeDefinition): ValidateMethod[] => {
  const validators: ValidateMethod[] = []

  if (hasMinLength(definition)) {
    validators.push(greaterThanOrEqual(definition.minLength))
  }

  if (hasMaxLength(definition)) {
    validators.push(lessThanOrEqual(definition.maxLength))
  }

  if (hasMin(definition) || hasExclusiveMin(definition)) {
    validators.push(greaterThan(definition.minimum ?? definition.exclusiveMinimum))
  }

  if (hasMax(definition) || hasExclusiveMax(definition)) {
    validators.push(lessThan(definition.maximum ?? definition.exclusiveMaximum))
  }

  if (hasMinItems(definition)) {
    validators.push(greaterThanOrEqual(definition.minItems))
  }

  if (hasMaxItems(definition)) {
    validators.push(lessThanOrEqual(definition.maxItems))
  }

  return validators
}

const getAttrs = (definition: TypeDefinition): TypeDefinitionComponentAttrs => {
  const attrs: TypeDefinitionComponentAttrs = {}

  if (hasMinLength(definition) || hasMin(definition)) {
    attrs.min = definition.minLength ?? definition.minimum
  }

  if (hasMaxLength(definition) || hasMax(definition)) {
    attrs.max = definition.maxLength ?? definition.maximum
  }

  if (hasMultipleOf(definition)) {
    attrs.step = definition.multipleOf
  }

  return attrs
}

const getBaseComponent = (definition: TypeDefinition): null | TypeDefinitionComponent => {
  const { type, format, enum: defEnum } = definition

  if (isPydanticEnum(definition)) {
    const component = baseEnumInput
    component.attrs.options = defEnum as PydanticEnum<PydanticType>

    if (isPydanticType('array', type)) {
      component.attrs.multiple = true
    }

    return component
  }

  if (isPydanticType('string', type)) {
    let component
    if (isPydanticStringFormat(format)) {
      component = StringFormatComponentMap[format]
    } else {
      component = baseTextInput
    }

    return component
  }

  if (isPydanticType('boolean', type)) {
    const component = baseToggleInput
    return component
  }

  if (isPydanticType('number', type) || isPydanticType('integer', type)) {
    const component = baseNumberInput
    return component
  }

  if (isPydanticType('array', type)) {
    const component = baseEnumInput
    component.attrs.allowUnknownValue = true
    component.attrs.multiple = true

    return component
  }

  if (isPydanticType('object', type)) {
    const component = baseJsonInput
    return component
  }

  if (isPydanticType('null', type)) {
    return null
  }

  return baseTextInput
}


export const getComponentFromTypeDefinition = (definition: TypeDefinition): null | TypeDefinitionComponent => {
  const component = getBaseComponent(definition)

  if (!component) {
    return null
  }

  component.validators = getValidators(definition)
  component.attrs = { ...component.attrs, ...getAttrs(definition) }

  return component
}