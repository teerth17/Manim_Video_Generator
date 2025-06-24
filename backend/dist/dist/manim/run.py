from manim import *
from random import randint

class InternetExplanation(Scene):
    def construct(self):
        # Title
        title = Text("How Does the Internet Work?", font_size=36)
        self.play(Write(title))
        self.wait(2)
        self.play(FadeOut(title))
        
        # Simplified network diagram
        devices = ["Laptop", "Phone", "Server", "Router"]
        device_icons = []
        device_positions = []
        
        colors = [BLUE, GREEN, RED, YELLOW]
        
        for i, device in enumerate(devices):
            if device == "Router":
                icon = Square(fill_color=colors[i], fill_opacity=0.8, color=WHITE).scale(0.7)
                text = Text("Router", font_size=18).next_to(icon, DOWN)
            else:
                icon = Circle(fill_color=colors[i], fill_opacity=0.8, color=WHITE).scale(0.5)
                text = Text(device, font_size=18).next_to(icon, DOWN)
                
            group = VGroup(icon, text)
            angle = i * 90 * DEGREES
            position = 2 * np.array([np.cos(angle), np.sin(angle), 0])
            group.move_to(position)
            device_positions.append(position)
            
            self.play(FadeIn(group), run_time=0.5)
            device_icons.append(group)
        
        # Connect devices to router
        router_pos = device_positions[3]
        connections = []
        for i in range(3):
            line = Line(device_positions[i], router_pos, color=WHITE)
            self.play(Create(line), run_time=0.5)
            connections.append(line)
        
        # Data packet animation
        packet = Square(fill_color=PURPLE, fill_opacity=0.8, color=WHITE, side_length=0.3)
        packet_label = Text("Data", font_size=12).move_to(packet)
        packet_group = VGroup(packet, packet_label)
        
        self.play(FadeIn(packet_group))
        packet_group.generate_target()
        packet_group.target.move_to(router_pos)
        
        # Animate packet moving between devices
        for i in range(3):
            start = device_positions[i]
            packet_group.move_to(start)
            
            packet_group.generate_target()
            packet_group.target.move_to(router_pos)
            self.play(MoveToTarget(packet_group), run_time=1)
            
            packet_group.generate_target()
            packet_group.target.move_to(device_positions[(i+1)%3])
            self.play(MoveToTarget(packet_group), run_time=1)
            
            packet_group.generate_target()
            packet_group.target.move_to(router_pos)
            self.play(MoveToTarget(packet_group), run_time=1)
        
        # Clean up
        self.play(*[FadeOut(obj) for obj in device_icons + connections + [packet_group]])
        
        # Internet cloud
        cloud = SVGMobject("cloud").scale(2).set_fill(WHITE, opacity=0.5)
        cloud_label = Text("Internet", font_size=24).move_to(cloud.get_center())
        internet = VGroup(cloud, cloud_label)
        
        self.play(FadeIn(internet))
        self.wait(2)
        
        # Final message
        final_text = Text("Global network of connected computers!", font_size=28)
        self.play(FadeOut(internet), FadeIn(final_text))
        self.wait(3)
        self.play(FadeOut(final_text))