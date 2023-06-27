#! /bin/bash

export MODEL_NAME="CompVis/stable-diffusion-v1-4"
export TRAIN_DIR="/home/app/data/train"
export OUTPUT_DIR="generativeAAC"

ls $TRAIN_DIR

accelerate launch diffusers/examples/text_to_image/train_text_to_image.py \
  --pretrained_model_name_or_path=$MODEL_NAME \
  --train_data_dir=$TRAIN_DIR \
  --use_ema \
  --resolution=512 --center_crop --random_flip \
  --train_batch_size=1 \
  --gradient_accumulation_steps=4 \
  --gradient_checkpointing \
  --mixed_precision="no" \
  --max_train_steps=15000 \
	--caption_column="additional_feature" \
  --learning_rate=1e-05 \
  --max_grad_norm=1 \
  --lr_scheduler="constant"  \
  --output_dir=${OUTPUT_DIR}
