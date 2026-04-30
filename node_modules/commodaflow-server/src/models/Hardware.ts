import { Schema, model } from 'mongoose';

export type HardwareStatus = 'available' | 'rented' | 'maintenance';

// 1. Definimos la interfaz pura (sin extender Document para evitar conflictos con 'model')
export interface IHardware {
  model: string;
  specs: string;
  dailyRate: number;
  status: HardwareStatus;
  createdAt: Date;
}

const hardwareSchema = new Schema<IHardware>({
  model: { 
    type: String, 
    required: true,
    trim: true 
  },
  specs: { 
    type: String, 
    required: true 
  },
  dailyRate: { 
    type: Number, 
    required: true,
    min: 0
  },
  status: { 
    type: String, 
    enum: ['available', 'rented', 'maintenance'], 
    default: 'available' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  // 2. Transformación segura para TypeScript
  toJSON: {
    virtuals: true,
    versionKey: false,
    transform: (_doc, ret: any) => {
      ret.id = ret._id; 
      delete ret._id;   
    }
  }
});

export const Hardware = model<IHardware>('Hardware', hardwareSchema);