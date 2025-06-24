from manim import *

class FallbackScene(Scene):
    def construct(self):
        # Simple fallback animation
        title = Text("```python
from manim import *

class GeneratedScen...")
        title.scale(0.8)
        
        self.play(Write(title))
        self.wait(1)
        
        # Simple shape animation
        circle = Circle(radius=1, color=BLUE, fill_opacity=0.3)
        circle.move_to(DOWN * 1)
        
        self.play(Create(circle))
        self.play(circle.animate.scale(1.5))
        self.play(circle.animate.shift(UP * 2))
        self.wait(1)
