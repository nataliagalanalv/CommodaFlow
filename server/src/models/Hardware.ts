import { Schema, model, Document, Types } from 'mongoose';

export type HardwareStatus = 'available' | 'rented' | 'maintenance';

export interface IHardware {
  model: string;
  specs: string;
  category: 'laptop' | 'tablet' | 'peripheral';
  dailyRate: number;
  status: HardwareStatus;
  createdAt: Date;
}

interface HardwareDocument extends IHardware {
  _id: Types.ObjectId; // MongoDB siempre tiene _id, pero no lo exponemos como 'id' aquí  
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
  category: { 
    type: String, 
    enum: ['laptop', 'tablet', 'peripheral'], 
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
    // 💡 Aquí está la magia: tipamos 'ret' correctamente
    transform: (_doc, ret: Partial<HardwareDocument> & { id?: string }) => {
      if (ret._id) {
        ret.id = ret._id.toString();
        delete ret._id;
      }
      return ret;
      }
  }
});

export const Hardware = model<IHardware>('Hardware', hardwareSchema);