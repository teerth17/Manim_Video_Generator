
  from manim import *
  
  class MyScene(Scene):
      def construct(self):
          text = Text("import * from manim")

class CircleToSquare(Scene):
    def construct(self):
        # Create a circle
        circle = Circle(color=BLUE, fill_opacity=0.5)
        
        # Create a square
        square = Square(color=GREEN, fill_opacity=0.5)
        
        # Position the square to the right of the circle
        square.next_to(circle, RIGHT, buff=1)
        
        # Show creation of circle
        self.play(Create(circle))
        self.wait(0.5)
        
        # Transform circle into square
        self.play(Transform(circle, square))
        self.wait(1)
        
        # Fade out both shapes
        self.play(FadeOut(circle))
")
          self.play(Write(text))
          self.wait(1)
  