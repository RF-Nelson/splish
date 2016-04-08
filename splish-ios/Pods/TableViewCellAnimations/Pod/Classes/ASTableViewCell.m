//
//  ASTableViewCell.m
//  TableViewCellAnimations
//
//  Created by Adam Suskin on 11/21/15.
//  Copyright © 2015 Adam Suskin. All rights reserved.
//

#import "ASTableViewCell.h"

@implementation ASTableViewCell


- (void)awakeFromNib {
    _animations = kASTableViewCellAnimationNone;
    
    [self setDuration:0.5];
}

- (void)animate {
    //Quickly decide if we should just skip over all if checks
    if(_animations == kASTableViewCellAnimationNone)
        return;
    
    //Handle setting up
    [self setUpAnimations];
    
    //Handle execution
    [UIView animateWithDuration:[self duration]
                     animations:^{
                         [self executeAnimations];
                     }];
}

-(BOOL)validateAnimation:(ASTableViewCellAnimation)animation {
    //Check each conflicting type
    if((_animations&kASTableViewCellAnimationSlideFromLeft) && animation == kASTableViewCellAnimationSlideFromRight)
        return NO;
    if((_animations&kASTableViewCellAnimationSlideFromRight) && animation == kASTableViewCellAnimationSlideFromLeft)
        return NO;
    if((_animations&kASTableViewCellAnimationSlideFromTop) && animation == kASTableViewCellAnimationSlideFromBottom)
        return NO;
    if((_animations&kASTableViewCellAnimationSlideFromBottom) && animation == kASTableViewCellAnimationSlideFromTop)
        return NO;
    
    return YES;
}

-(BOOL)addAnimation:(ASTableViewCellAnimation)animation {
    //if the animation is already applied or conflicts, reject the animation
    if(_animations&animation || ![self validateAnimation:animation]) {
        return NO;
    }
    else {
        //add the animation
        _animations |= animation;
        return YES;
    }
}

-(void)setUpAnimations {
    if(_animations&kASTableViewCellAnimationFadeIn)
        [[self layer] setOpacity:0];
    if(_animations&kASTableViewCellAnimationSlideFromLeft)
        [[self layer] setTransform:CATransform3DTranslate(self.layer.transform, -20, 0, 0)];
    if(_animations&kASTableViewCellAnimationSlideFromRight)
        [[self layer] setTransform:CATransform3DTranslate(self.layer.transform, 20, 0, 0)];
    if(_animations&kASTableViewCellAnimationSlideFromTop)
        [[self layer] setTransform:CATransform3DTranslate(self.layer.transform, 0, -20, 0)];
    if(_animations&kASTableViewCellAnimationSlideFromBottom)
        [[self layer] setTransform:CATransform3DTranslate(self.layer.transform, 0, 20, 0)];
    if(_animations&kASTableViewCellAnimationFlipHorizontally)
        [[self layer] setTransform:CATransform3DRotate(self.layer.transform, M_PI, 0, 1, 0)];
    if(_animations&kASTableViewCellAnimationFlipVertically)
        [[self layer] setTransform:CATransform3DRotate(self.layer.transform, M_PI, 1, 0, 0)];
    
}

-(void)restoreTransform {
    [[self layer] setTransform:CATransform3DIdentity];
}

-(void)executeAnimations {
    if(_animations&kASTableViewCellAnimationFadeIn)
        [[self layer] setOpacity:1];
    
    //Check for slides (all result in same transform)
    if(_animations&(kASTableViewCellAnimationSlideFromLeft|kASTableViewCellAnimationSlideFromRight|kASTableViewCellAnimationSlideFromTop|kASTableViewCellAnimationSlideFromBottom))
        [self restoreTransform];
    
    //Check for flips (all result in same transform)
    if(_animations&(kASTableViewCellAnimationFlipHorizontally|kASTableViewCellAnimationFlipVertically))
        [self restoreTransform];
}

@end
