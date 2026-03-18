"""ML model training utilities."""
import time, math, random, logging, json
from typing import Any, Callable, Dict, List, Optional, Tuple
from dataclasses import dataclass, field
from pathlib import Path

logger = logging.getLogger(__name__)

@dataclass
class TrainingConfig:
    learning_rate: float = 1e-3
    batch_size: int = 32
    epochs: int = 10
    weight_decay: float = 0.01
    warmup_steps: int = 100
    max_grad_norm: float = 1.0
    eval_steps: int = 500
    save_steps: int = 1000
    seed: int = 42
    output_dir: str = "./output"

@dataclass
class TrainingMetrics:
    epoch: int
    step: int
    loss: float
    learning_rate: float
    throughput: float  # samples/sec
    eval_loss: Optional[float] = None
    eval_accuracy: Optional[float] = None
    timestamp: float = field(default_factory=time.time)

class LRScheduler:
    """Learning rate scheduler with warmup and cosine decay."""

    def __init__(self, base_lr: float, warmup_steps: int, total_steps: int):
        self.base_lr = base_lr
        self.warmup_steps = warmup_steps
        self.total_steps = total_steps

    def get_lr(self, step: int) -> float:
        if step < self.warmup_steps:
            return self.base_lr * (step / max(1, self.warmup_steps))
        progress = (step - self.warmup_steps) / max(1, self.total_steps - self.warmup_steps)
        return self.base_lr * 0.5 * (1 + math.cos(math.pi * progress))

class EarlyStopping:
    """Stop training when validation loss stops improving."""

    def __init__(self, patience: int = 5, min_delta: float = 1e-4):
        self.patience = patience
        self.min_delta = min_delta
        self.best_loss = float("inf")
        self.counter = 0

    def should_stop(self, val_loss: float) -> bool:
        if val_loss < self.best_loss - self.min_delta:
            self.best_loss = val_loss
            self.counter = 0
            return False
        self.counter += 1
        return self.counter >= self.patience

class ModelTrainer:
    """Training loop with logging, checkpointing, and evaluation."""

    def __init__(self, config: TrainingConfig):
        self.config = config
        self.history: List[TrainingMetrics] = []
        self._global_step = 0
        random.seed(config.seed)

    def train(self, train_data: List[Any], eval_data: Optional[List[Any]] = None,
              loss_fn: Optional[Callable] = None) -> Dict[str, Any]:
        total_steps = len(train_data) // self.config.batch_size * self.config.epochs
        scheduler = LRScheduler(self.config.learning_rate, self.config.warmup_steps, total_steps)
        early_stop = EarlyStopping()
        best_eval_loss = float("inf")

        logger.info(f"Starting training: {self.config.epochs} epochs, {total_steps} total steps")

        for epoch in range(self.config.epochs):
            epoch_loss = 0
            epoch_samples = 0
            start = time.time()

            # Simulate batches
            n_batches = max(1, len(train_data) // self.config.batch_size)
            for batch_idx in range(n_batches):
                self._global_step += 1
                lr = scheduler.get_lr(self._global_step)

                # Simulate loss (decreasing with noise)
                progress = self._global_step / max(1, total_steps)
                loss = 2.0 * (1 - progress) + random.gauss(0, 0.1 * (1 - progress))
                loss = max(0.01, loss)
                epoch_loss += loss
                epoch_samples += self.config.batch_size

                if self._global_step % self.config.eval_steps == 0 and eval_data:
                    eval_loss = loss * 1.1 + random.gauss(0, 0.05)
                    eval_acc = min(0.99, 0.5 + 0.4 * progress + random.gauss(0, 0.02))
                    self.history.append(TrainingMetrics(
                        epoch=epoch, step=self._global_step, loss=loss,
                        learning_rate=lr, throughput=epoch_samples / max(0.01, time.time() - start),
                        eval_loss=eval_loss, eval_accuracy=eval_acc))

                    if early_stop.should_stop(eval_loss):
                        logger.info(f"Early stopping at step {self._global_step}")
                        break

            avg_loss = epoch_loss / max(1, n_batches)
            elapsed = time.time() - start
            logger.info(f"Epoch {epoch+1}/{self.config.epochs}: loss={avg_loss:.4f}, "
                       f"lr={scheduler.get_lr(self._global_step):.6f}, "
                       f"{epoch_samples/max(0.01,elapsed):.0f} samples/sec")

        return self.get_summary()

    def get_summary(self) -> Dict[str, Any]:
        if not self.history:
            return {"status": "no_training_data"}
        final = self.history[-1]
        return {"total_steps": self._global_step, "final_loss": round(final.loss, 4),
                "final_eval_loss": round(final.eval_loss, 4) if final.eval_loss else None,
                "final_eval_accuracy": round(final.eval_accuracy, 4) if final.eval_accuracy else None,
                "total_metrics_logged": len(self.history)}
