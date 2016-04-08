//
//  ASTableViewCell.h
//  TableViewCellAnimations
//
//  Created by Adam Suskin on 11/21/15.
//  Copyright © 2015 Adam Suskin. All rights reserved.
//

#import <UIKit/UIKit.h>

/**
 * Available animations with ASTableViewCellAnimation.
 */
typedef NS_ENUM(NSInteger, ASTableViewCellAnimation) {
    /**
     * No animations
     */
    kASTableViewCellAnimationNone = 0,
    /**
     * Fade in animation - opacity starts at 0 and animates to 1.
     */
    kASTableViewCellAnimationFadeIn = 1 << 0,
    /**
     * Slide from left animation - cell moves into slot from left.
     */
    kASTableViewCellAnimationSlideFromLeft = 1 << 1,
    /**
     * Slide from right animation - cell moves into slot from right.
     */
    kASTableViewCellAnimationSlideFromRight = 1 << 2,
    /**
     * Slide from top animation - cell moves into slot from top.
     */
    kASTableViewCellAnimationSlideFromTop = 1 << 3,
    /**
     * Slide from bottom animation - cell moves into slot from bottom.
     */
    kASTableViewCellAnimationSlideFromBottom = 1 << 4,
    /**
     * Flip horizontally animation - cell flips horizontally.
     */
    kASTableViewCellAnimationFlipHorizontally = 1 << 5,
    /**
     * Flip vertically animation - cell flips vertically.
     */
    kASTableViewCellAnimationFlipVertically = 1 << 6
    
};

@interface ASTableViewCell : UITableViewCell

/**
 * Call this method in cellWillAppear: in order to execute any animations on the cell.
 */
-(void)animate;

/**
 * Add an ASTableViewCellAnimation to the cell.
 * Note: if the animation contradicts with an already existing animation, 
 * e.g. adding slide from right on top of slide from left, then no animation 
 * will be added and the method will return NO.
 *
 * @param animation the animation to add to the cell
 * @see ASTableViewCellAnimation
 * @return successful addition of the cell without conflicts
 */
-(BOOL)addAnimation:(ASTableViewCellAnimation)animation;

/**
 * The animations on an ASTableViewCell (readonly)
 */
@property (assign, nonatomic, readonly) NSInteger animations;

/**
 * The duration of the entrance animation
 */
@property (assign, nonatomic) NSTimeInterval duration;

@end
