import { FieldTree } from '@angular/forms/signals';
import { CreateLocation } from '../../../core/types/dtos/write/location-write.types';

export type TagMetadata = CreateLocation;

export type TagMetadataForm = FieldTree<TagMetadata>;
